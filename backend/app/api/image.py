from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.schemas.image_schema import ImageRequest, ImageResponse, EditImageResponse
from app.services.image_service import (
    generate_image,
    delete_image_by_id,
    delete_all_images,
    edit_image,
)
from app.database.db import get_db
from app.models.image_model import Image
from app.auth.auth import get_current_user

router = APIRouter()


@router.post("/generate-image")
def create_image(
    request: ImageRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return generate_image(
        request.prompt,
        request.model,
        request.style,
        request.aspect_ratio,
        current_user["id"],
        db,
    )


@router.get("/images", response_model=List[ImageResponse])
def get_images(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    images = (
        db.query(Image)
        .filter(Image.user_id == current_user["id"])
        .order_by(Image.id.desc())
        .all()
    )
    return images


@router.patch("/images/{id}/favorite")
def toggle_favorite(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    image = (
        db.query(Image)
        .filter(Image.id == id, Image.user_id == current_user["id"])
        .first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    image.favorite = not image.favorite
    db.commit()
    db.refresh(image)
    return {
        "success": True,
        "favorite": image.favorite
    }


@router.get("/favorites", response_model=List[ImageResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    favorites = (
        db.query(Image)
        .filter(Image.user_id == current_user["id"], Image.favorite.is_(True))
        .order_by(Image.id.desc())
        .all()
    )
    return favorites


@router.delete("/images/{id}")
def delete_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Ownership is verified here, before delegating to the service. Since
    # `id` is a unique primary key, confirming ownership first guarantees
    # a user can never trigger deletion of another user's image by
    # guessing/iterating IDs — even though delete_image_by_id(id, db, user_id)
    # itself also re-filters by user_id as a second guard.
    image = (
        db.query(Image)
        .filter(Image.id == id, Image.user_id == current_user["id"])
        .first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    return delete_image_by_id(id, db, current_user["id"])


@router.delete("/images")
def delete_all(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # img_service.delete_all_images(db, user_id) is scoped by user_id and
    # now also removes each image's Supabase Storage object (with a
    # legacy /uploads/ fallback), so this delegates to it directly
    # instead of duplicating the query/delete logic here. Without this
    # delegation, the Storage cleanup added to the service never runs.
    # Response shape ({success, deleted_count}) is unchanged.
    return delete_all_images(db, current_user["id"])


@router.post("/edit-image")
async def edit_image_endpoint(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return edit_image(image, prompt, db, current_user["id"])