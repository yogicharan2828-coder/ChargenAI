"""
Profile API router.

Single endpoint: GET /profile
This file only wires request -> service -> response. No queries here.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.profile_schema import ProfileResponse
from app.services import profile_service
from app.auth.auth import get_current_user

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Return profile statistics (images generated, favorites, projects,
    member_since) plus the 5 most recent images and 5 most recent
    projects, newest first — scoped to the authenticated user.
    """
    return profile_service.get_profile_data(db, current_user["id"])