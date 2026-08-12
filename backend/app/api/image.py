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
    # NOTE: image_service.generate_image does not yet accept user_id/db.
    # Passing them now so the next step's service signature change is a
    # drop-in match. Until image_service.py is updated, this call will
    # raise a TypeError.
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
    # guessing/iterating IDs — even though delete_image_by_id(id, db)
    # itself has no user filter.
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
    # image_service.delete_all_images(db) has no user filter and would
    # delete every user's images — delegating to it as-is would be a
    # cross-user data-loss bug. Ownership filtering is done directly here
    # instead. NOTE: this bypasses whatever file-cleanup-on-disk logic
    # lives inside delete_all_images, so uploaded files for these rows
    # will be orphaned on disk until image_service.py is updated to
    # accept a user_id filter (expected: delete_all_images(db, user_id)),
    # at which point this route should go back to delegating to it.
    images = (
        db.query(Image)
        .filter(Image.user_id == current_user["id"])
        .all()
    )
    deleted_count = len(images)
    for image in images:
        db.delete(image)
    db.commit()

    return {
        "success": True,
        "deleted_count": deleted_count,
    }


@router.post("/edit-image")
async def edit_image_endpoint(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Same temporary incompatibility as /generate-image: image_service.edit_image
    # does not yet accept user_id. Passing it now so the next step's
    # service signature change is a drop-in match.
    return edit_image(image, prompt, db, current_user["id"])