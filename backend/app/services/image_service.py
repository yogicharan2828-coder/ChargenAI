import os
import uuid
import mimetypes
import base64
from io import BytesIO
from typing import Optional

import requests
from dotenv import load_dotenv
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from PIL import Image as PILImage, UnidentifiedImageError
from supabase import create_client, Client

from app.models.image_model import Image

load_dotenv()

# ==================================================
# Cloudflare Workers AI configuration
# Shared by BOTH text-to-image generation (below) and
# the existing image editing implementation (unchanged,
# further down in this file).
# ==================================================

CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

CLOUDFLARE_IMAGE_MODEL = (
    "@cf/black-forest-labs/flux-2-klein-4b"
)

UPLOAD_DIR = "uploads"
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==================================================
# Supabase Storage configuration
# Used by generate_image() and edit_image() to persist
# generated/edited PNGs, since Render's local filesystem
# is ephemeral. The local uploads/ handling above is kept
# temporarily so delete_image_by_id()/delete_all_images()
# can still clean up rows created before this migration.
# ==================================================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_STORAGE_BUCKET = "chargen-images"

_supabase_client: Optional[Client] = None


def _get_supabase_client() -> Client:
    global _supabase_client

    if not SUPABASE_URL:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "SUPABASE_URL is not configured."
            }
        )

    if not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "SUPABASE_SERVICE_ROLE_KEY is not configured."
            }
        )

    if _supabase_client is None:
        _supabase_client = create_client(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
        )

    return _supabase_client


def _upload_png_to_supabase_storage(
    png_bytes: bytes,
    storage_path: str,
) -> str:
    """
    Uploads PNG bytes to SUPABASE_STORAGE_BUCKET at storage_path and
    returns the public URL. Raises HTTPException on any failure —
    callers must not create a database record if this raises.
    """

    client = _get_supabase_client()

    try:
        client.storage.from_(SUPABASE_STORAGE_BUCKET).upload(
            path=storage_path,
            file=png_bytes,
            file_options={
                "content-type": "image/png",
                # storage3 expects string values here, not Python bools
                "upsert": "false",
            },
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "storage_upload_failed",
                "message": (
                    "Failed to upload image to Supabase Storage: "
                    f"{exc}"
                )
            }
        ) from exc

    try:
        public_url = (
            client.storage
            .from_(SUPABASE_STORAGE_BUCKET)
            .get_public_url(storage_path)
        )

    except Exception as exc:
        # Upload succeeded but the URL could not be resolved — clean
        # up rather than leaving an orphaned object behind.
        _delete_from_supabase_storage(storage_path)

        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "storage_url_failed",
                "message": (
                    "Image was uploaded but its public URL could "
                    f"not be retrieved: {exc}"
                )
            }
        ) from exc

    if not public_url:
        _delete_from_supabase_storage(storage_path)

        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "storage_url_failed",
                "message": "Supabase Storage returned an empty public URL."
            }
        )

    return public_url


def _delete_from_supabase_storage(storage_path: str) -> None:
    """
    Best-effort delete of a Storage object. Never raises: used both
    for normal deletes and for cleaning up orphans after a partial
    failure, neither of which should crash the caller.
    """

    try:
        client = _get_supabase_client()
        client.storage.from_(SUPABASE_STORAGE_BUCKET).remove([storage_path])

    except Exception:
        pass


def _extract_supabase_storage_path(image_url: str) -> Optional[str]:
    """
    Returns the '<user_id>/<filename>.png' storage path if image_url
    points at our Supabase Storage bucket, else None — meaning it's a
    legacy Render /uploads/... URL predating this migration.
    """

    marker = f"/storage/v1/object/public/{SUPABASE_STORAGE_BUCKET}/"

    if marker in image_url:
        return image_url.split(marker, 1)[1]

    return None


# --------------------------------------------------
# Aspect ratio -> pixel dimensions (generation only)
# --------------------------------------------------

ASPECT_RATIO_DIMENSIONS = {
    "16:9": (1024, 576),
    "1:1": (1024, 1024),
    "4:3": (1024, 768),
    "3:4": (768, 1024),
    "9:16": (576, 1024),
}


def _resolve_dimensions(aspect_ratio: str):
    return ASPECT_RATIO_DIMENSIONS.get(
        aspect_ratio,
        (1024, 1024)
    )


def _build_generation_prompt(prompt: str, style: str) -> str:
    cleaned_style = (style or "").strip().lower()

    if not cleaned_style or cleaned_style == "realistic":
        return prompt

    return f"{prompt}, {cleaned_style} style"


# ==================================================
# Text-to-image generation
# Cloudflare Workers AI — FLUX.2 Klein 4B
# ==================================================

def generate_image(
    prompt: str,
    model: str,
    style: str,
    aspect_ratio: str,
    user_id: str,
    db: Session,
):
    # --------------------------------------------------
    # Validate Cloudflare configuration
    # --------------------------------------------------

    if not CLOUDFLARE_ACCOUNT_ID:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "CLOUDFLARE_ACCOUNT_ID is not configured."
            }
        )

    if not CLOUDFLARE_API_TOKEN:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "CLOUDFLARE_API_TOKEN is not configured."
            }
        )

    # --------------------------------------------------
    # Validate prompt
    # --------------------------------------------------

    cleaned_prompt = (prompt or "").strip()

    if not cleaned_prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty."
        )

    width, height = _resolve_dimensions(aspect_ratio)
    generation_prompt = _build_generation_prompt(cleaned_prompt, style)

    # --------------------------------------------------
    # Prepare Cloudflare request
    # --------------------------------------------------

    endpoint = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{CLOUDFLARE_ACCOUNT_ID}/ai/run/"
        f"{CLOUDFLARE_IMAGE_MODEL}"
    )

    data = {
        "prompt": generation_prompt,
        "width": str(width),
        "height": str(height),
    }

    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}"
    }

    # --------------------------------------------------
    # Call Cloudflare Workers AI
    # --------------------------------------------------

    try:
        response = requests.post(
            endpoint,
            headers=headers,
            data=data,
            timeout=180,
        )

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "provider_connection",
                "message": (
                    "Could not connect to Cloudflare Workers AI."
                )
            }
        ) from exc

    # --------------------------------------------------
    # Handle Cloudflare errors
    # --------------------------------------------------

    if not response.ok:

        try:
            error_data = response.json()

            message = (
                error_data.get("errors")
                or error_data.get("message")
                or error_data.get("result")
                or "Cloudflare Workers AI request failed."
            )

        except ValueError:
            message = response.text or (
                "Cloudflare Workers AI request failed."
            )

        if response.status_code == 401:
            error_type = "authentication"

        elif response.status_code == 403:
            error_type = "permission"

        elif response.status_code == 429:
            error_type = "quota"

        elif response.status_code == 400:
            error_type = "invalid_request"

        else:
            error_type = "provider_failure"

        raise HTTPException(
            status_code=502,
            detail={
                "error_type": error_type,
                "message": str(message)
            }
        )

    # --------------------------------------------------
    # Parse Cloudflare response
    # --------------------------------------------------

    try:
        result = response.json()

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_response",
                "message": (
                    "Cloudflare returned an invalid response."
                )
            }
        ) from exc

    image_base64 = None

    # Cloudflare Workers AI image models return:
    #
    # {
    #     "result": {
    #         "image": "<base64>"
    #     }
    # }

    result_data = result.get("result")

    if isinstance(result_data, dict):
        image_base64 = result_data.get("image")

    if not image_base64:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "unsupported_response",
                "message": (
                    "Cloudflare did not return a generated image."
                )
            }
        )

    # --------------------------------------------------
    # Decode generated image
    # --------------------------------------------------

    try:
        generated_image_bytes = base64.b64decode(
            image_base64
        )

    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_image",
                "message": (
                    "Cloudflare returned invalid image data."
                )
            }
        ) from exc

    if not generated_image_bytes:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "empty_image",
                "message": (
                    "Cloudflare returned an empty image."
                )
            }
        )

    # --------------------------------------------------
    # Validate generated image
    # --------------------------------------------------

    try:
        with PILImage.open(
            BytesIO(generated_image_bytes)
        ) as validated_image:

            validated_image.verify()

    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_image",
                "message": (
                    "Cloudflare returned data that is "
                    "not a valid image."
                )
            }
        ) from exc

    # --------------------------------------------------
    # Re-encode as PNG in memory (mirrors the previous
    # on-disk normalization) and upload to Supabase Storage
    # --------------------------------------------------

    filename = f"{uuid.uuid4().hex}.png"
    storage_path = f"{user_id}/{filename}"

    png_buffer = BytesIO()

    try:
        with PILImage.open(
            BytesIO(generated_image_bytes)
        ) as generated_pil_image:

            generated_pil_image.save(
                png_buffer,
                format="PNG"
            )

    except OSError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to process the generated image."
        ) from exc

    image_url = _upload_png_to_supabase_storage(
        png_bytes=png_buffer.getvalue(),
        storage_path=storage_path,
    )

    # --------------------------------------------------
    # Save generated image to database
    # --------------------------------------------------

    try:
        db_image = Image(
            user_id=user_id,
            prompt=cleaned_prompt,
            image_url=image_url,
            model=CLOUDFLARE_IMAGE_MODEL,
            style=style,
            aspect_ratio=aspect_ratio,
        )

        db.add(db_image)
        db.commit()
        db.refresh(db_image)

        # Capture values before returning, matching prior pattern.
        saved_image_id = db_image.id
        saved_prompt = db_image.prompt
        saved_model = db_image.model
        saved_image_url = db_image.image_url

    except SQLAlchemyError as exc:

        db.rollback()

        # Storage upload already succeeded — remove the now-orphaned
        # object rather than leaving it behind with no database row.
        _delete_from_supabase_storage(storage_path)

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save the generated image "
                "record to the database."
            )
        ) from exc

    # --------------------------------------------------
    # Success
    # --------------------------------------------------

    return {
        "success": True,
        "image_id": saved_image_id,
        "image_url": saved_image_url,
        "prompt": saved_prompt,
        "model": saved_model,
    }


# ==================================================
# Delete single image
# ==================================================
def delete_image_by_id(image_id: int, db: Session, user_id: str):
    image = (
        db.query(Image)
        .filter(Image.id == image_id, Image.user_id == user_id)
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    storage_path = _extract_supabase_storage_path(image.image_url)

    if storage_path:
        # New-style image: lives in Supabase Storage.
        _delete_from_supabase_storage(storage_path)
    else:
        # Legacy image predating the Supabase Storage migration —
        # still lives (if at all) on Render's local uploads/ dir.
        filename = os.path.basename(image.image_url)
        filepath = os.path.join(UPLOAD_DIR, filename)

        if os.path.exists(filepath):
            os.remove(filepath)

    db.delete(image)
    db.commit()

    return {
        "success": True
    }


# ==================================================
# Delete all images (scoped to a single user)
# ==================================================

def delete_all_images(db: Session, user_id: str):
    images = (
        db.query(Image)
        .filter(Image.user_id == user_id)
        .all()
    )

    deleted_count = len(images)

    for image in images:
        storage_path = _extract_supabase_storage_path(image.image_url)

        if storage_path:
            _delete_from_supabase_storage(storage_path)
        else:
            filename = os.path.basename(image.image_url)
            filepath = os.path.join(UPLOAD_DIR, filename)

            if os.path.exists(filepath):
                os.remove(filepath)

        db.delete(image)

    db.commit()

    return {
        "success": True,
        "deleted_count": deleted_count,
    }


# ==================================================
# Cloudflare Workers AI image editing
# FLUX.2 Klein 4B
# (Unchanged — configuration lives near load_dotenv()
# above so it is shared with generate_image() rather than
# duplicated here.)
# ==================================================

def edit_image(
    image_file: UploadFile,
    prompt: str,
    db: Session,
    user_id: str,
):
    # --------------------------------------------------
    # Validate Cloudflare configuration
    # --------------------------------------------------

    if not CLOUDFLARE_ACCOUNT_ID:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "CLOUDFLARE_ACCOUNT_ID is not configured."
            }
        )

    if not CLOUDFLARE_API_TOKEN:
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "configuration",
                "message": "CLOUDFLARE_API_TOKEN is not configured."
            }
        )

    # --------------------------------------------------
    # Validate uploaded image
    # --------------------------------------------------

    if image_file is None or not image_file.filename:
        raise HTTPException(
            status_code=400,
            detail="An image file is required."
        )

    cleaned_prompt = (prompt or "").strip()

    if not cleaned_prompt:
        raise HTTPException(
            status_code=400,
            detail="Editing prompt cannot be empty."
        )

    raw_bytes = image_file.file.read()

    if not raw_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # --------------------------------------------------
    # Validate image format
    # --------------------------------------------------

    try:
        with PILImage.open(BytesIO(raw_bytes)) as validated:
            validated.verify()

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image."
        )

    mime_type = (
        image_file.content_type
        or mimetypes.guess_type(
            image_file.filename or ""
        )[0]
        or "image/png"
    )

    # --------------------------------------------------
    # Prepare Cloudflare request
    # --------------------------------------------------

    endpoint = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{CLOUDFLARE_ACCOUNT_ID}/ai/run/"
        f"{CLOUDFLARE_IMAGE_MODEL}"
    )

    files = {
        "input_image_0": (
            image_file.filename or "input.png",
            raw_bytes,
            mime_type
        )
    }

    data = {
        "prompt": cleaned_prompt,
        "width": "1024",
        "height": "1024",
    }

    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}"
    }

    # --------------------------------------------------
    # Call Cloudflare Workers AI
    # --------------------------------------------------

    try:
        response = requests.post(
            endpoint,
            headers=headers,
            data=data,
            files=files,
            timeout=180,
        )

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "provider_connection",
                "message": (
                    "Could not connect to Cloudflare Workers AI."
                )
            }
        ) from exc

    # --------------------------------------------------
    # Handle Cloudflare errors
    # --------------------------------------------------

    if not response.ok:

        try:
            error_data = response.json()

            message = (
                error_data.get("errors")
                or error_data.get("message")
                or error_data.get("result")
                or "Cloudflare Workers AI request failed."
            )

        except ValueError:
            message = response.text or (
                "Cloudflare Workers AI request failed."
            )

        if response.status_code == 401:
            error_type = "authentication"

        elif response.status_code == 403:
            error_type = "permission"

        elif response.status_code == 429:
            error_type = "quota"

        elif response.status_code == 400:
            error_type = "invalid_request"

        else:
            error_type = "provider_failure"

        raise HTTPException(
            status_code=502,
            detail={
                "error_type": error_type,
                "message": str(message)
            }
        )

    # --------------------------------------------------
    # Parse Cloudflare response
    # --------------------------------------------------

    try:
        result = response.json()

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_response",
                "message": (
                    "Cloudflare returned an invalid response."
                )
            }
        ) from exc

    image_base64 = None

    # Cloudflare Workers AI image models return:
    #
    # {
    #     "result": {
    #         "image": "<base64>"
    #     }
    # }

    result_data = result.get("result")

    if isinstance(result_data, dict):
        image_base64 = result_data.get("image")

    if not image_base64:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "unsupported_response",
                "message": (
                    "Cloudflare did not return an edited image."
                )
            }
        )

    # --------------------------------------------------
    # Decode generated image
    # --------------------------------------------------

    try:
        edited_image_bytes = base64.b64decode(
            image_base64
        )

    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_image",
                "message": (
                    "Cloudflare returned invalid image data."
                )
            }
        ) from exc

    if not edited_image_bytes:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "empty_image",
                "message": (
                    "Cloudflare returned an empty image."
                )
            }
        )

    # --------------------------------------------------
    # Validate generated image
    # --------------------------------------------------

    try:
        with PILImage.open(
            BytesIO(edited_image_bytes)
        ) as edited_pil_image:

            edited_pil_image.verify()

    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error_type": "invalid_image",
                "message": (
                    "Cloudflare returned data that is "
                    "not a valid image."
                )
            }
        ) from exc

    # --------------------------------------------------
    # Re-encode as PNG in memory and upload to Supabase
    # Storage under the authenticated user's folder
    # --------------------------------------------------

    filename = f"{uuid.uuid4().hex}.png"
    storage_path = f"{user_id}/{filename}"

    png_buffer = BytesIO()

    try:
        with PILImage.open(
            BytesIO(edited_image_bytes)
        ) as edited_pil_image:

            edited_pil_image.save(
                png_buffer,
                format="PNG"
            )

    except OSError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to process the edited image."
        ) from exc

    image_url = _upload_png_to_supabase_storage(
        png_bytes=png_buffer.getvalue(),
        storage_path=storage_path,
    )

    # --------------------------------------------------
    # Save edited image to database
    # --------------------------------------------------

    try:
        db_image = Image(
            user_id=user_id,
            prompt=f"Edit: {cleaned_prompt}",
            image_url=image_url,
            model=CLOUDFLARE_IMAGE_MODEL,
            style="edited",
            aspect_ratio="original",
            favorite=False,
        )

        db.add(db_image)
        db.commit()
        db.refresh(db_image)

    except SQLAlchemyError as exc:

        db.rollback()

        _delete_from_supabase_storage(storage_path)

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save the edited image "
                "record to the database."
            )
        ) from exc

    # --------------------------------------------------
    # Success
    # --------------------------------------------------

    return {
        "success": True,
        "image_id": db_image.id,
        "image_url": db_image.image_url,
        "prompt": db_image.prompt,
        "model": db_image.model,
    }