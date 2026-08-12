from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func

from app.database.db import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    # Supabase authenticated user ID
    user_id = Column(String, nullable=False, index=True)

    prompt = Column(String, nullable=False)

    image_url = Column(String, nullable=False)

    model = Column(String, default="flux")

    style = Column(String, default="Realistic")

    aspect_ratio = Column(String, default="16:9")

    favorite = Column(
        Boolean,
        default=False,
        nullable=False,
        server_default="false"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )