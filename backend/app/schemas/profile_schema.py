"""
Pydantic schemas for the Profile API response.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class RecentImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    prompt: str
    image_url: str
    created_at: Optional[datetime] = None


class RecentProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None


class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    images_generated: int
    favorites: int
    projects: int
    member_since: Optional[datetime] = None
    recent_images: List[RecentImageResponse]
    recent_projects: List[RecentProjectResponse]