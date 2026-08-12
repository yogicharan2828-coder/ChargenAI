"""
Service layer for the Profile API.

Every database query needed for GET /profile lives in this file.
The router (app/api/profile.py) never touches the database directly —
it only calls get_profile_data() below.

Every query here is scoped to the authenticated user_id passed in by
the router (sourced from current_user["id"]). None of it accepts or
trusts a user_id from the frontend.
"""

from typing import Optional
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

# NOTE: adjust these two import paths if your models live somewhere
# other than app/models/. Nothing else in this file depends on
# where the files physically live.
from app.models.image_model import Image
from app.models.project_model import Project


def get_images_generated_count(db: Session, user_id: str) -> int:
    """Count images belonging to the authenticated user."""
    return db.query(Image).filter(Image.user_id == user_id).count()


def get_favorites_count(db: Session, user_id: str) -> int:
    """Count the authenticated user's images where favorite is True."""
    return (
        db.query(Image)
        .filter(Image.user_id == user_id, Image.favorite.is_(True))
        .count()
    )


def get_projects_count(db: Session, user_id: str) -> int:
    """Count projects belonging to the authenticated user."""
    return db.query(Project).filter(Project.user_id == user_id).count()


def get_member_since(db: Session, user_id: str) -> Optional[datetime]:
    """
    Return the oldest created_at value from the authenticated user's
    images. Returns None if the user has no images yet (func.min on
    an empty result set yields NULL, which SQLAlchemy surfaces as None).
    """
    return (
        db.query(func.min(Image.created_at))
        .filter(Image.user_id == user_id)
        .scalar()
    )


def get_recent_images(db: Session, user_id: str, limit: int = 5):
    """Return the authenticated user's latest `limit` images, newest first."""
    return (
        db.query(Image)
        .filter(Image.user_id == user_id)
        .order_by(Image.created_at.desc())
        .limit(limit)
        .all()
    )


def get_recent_projects(db: Session, user_id: str, limit: int = 5):
    """Return the authenticated user's latest `limit` projects, newest first."""
    return (
        db.query(Project)
        .filter(Project.user_id == user_id)
        .order_by(Project.created_at.desc())
        .limit(limit)
        .all()
    )


def get_profile_data(db: Session, user_id: str) -> dict:
    """
    Orchestrates every query needed for GET /profile, scoped to the
    authenticated user, and returns a single dict shaped to match
    ProfileResponse.

    This is the ONLY function the router calls.
    """
    return {
        "images_generated": get_images_generated_count(db, user_id),
        "favorites": get_favorites_count(db, user_id),
        "projects": get_projects_count(db, user_id),
        "member_since": get_member_since(db, user_id),
        "recent_images": get_recent_images(db, user_id),
        "recent_projects": get_recent_projects(db, user_id),
    }