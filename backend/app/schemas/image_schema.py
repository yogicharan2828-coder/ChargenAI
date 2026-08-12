from datetime import datetime

from pydantic import BaseModel


class ImageRequest(BaseModel):
    prompt: str
    model: str = "flux"
    aspect_ratio: str = "16:9"
    style: str = "realistic"


class ImageResponse(BaseModel):
    id: int
    prompt: str
    image_url: str
    model: str
    style: str
    aspect_ratio: str
    favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EditImageResponse(BaseModel):
    success: bool
    image_id: int
    image_url: str
    prompt: str
    model: str