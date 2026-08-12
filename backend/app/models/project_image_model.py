from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.db import Base


class ProjectImage(Base):
    __tablename__ = "project_images"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)

    added_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )