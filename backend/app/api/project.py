from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.schemas.image_schema import ImageResponse
from app.services import project_service
from app.auth.auth import get_current_user

router = APIRouter()


@router.post("/projects", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    return project_service.create_project(db, project, current_user["id"])


@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    return project_service.get_projects(db, current_user["id"])


@router.patch("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    updated_project = project_service.update_project(
        db, project_id, project, current_user["id"]
    )

    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")

    return updated_project


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    deleted = project_service.delete_project(db, project_id, current_user["id"])

    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"success": True}


@router.post("/projects/{project_id}/images/{image_id}")
def add_image_to_project(
    project_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    result = project_service.add_image_to_project(
        db, project_id, image_id, current_user["id"]
    )

    if result == "project_not_found":
        raise HTTPException(status_code=404, detail="Project not found")

    if result == "image_not_found":
        raise HTTPException(status_code=404, detail="Image not found")

    if result == "already_exists":
        raise HTTPException(
            status_code=400,
            detail="Image already exists in this project",
        )

    return {"success": True}


@router.get("/projects/{project_id}/images", response_model=List[ImageResponse])
def get_project_images(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    images = project_service.get_project_images(db, project_id, current_user["id"])

    if images is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return images


@router.delete("/projects/{project_id}/images/{image_id}")
def remove_image_from_project(
    project_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    removed = project_service.remove_image_from_project(
        db, project_id, image_id, current_user["id"]
    )

    if not removed:
        raise HTTPException(status_code=404, detail="Relationship not found")

    return {"success": True}