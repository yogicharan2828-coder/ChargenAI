from sqlalchemy.orm import Session

from app.models.project_model import Project
from app.models.image_model import Image
from app.models.project_image_model import ProjectImage
from app.schemas.project_schema import ProjectCreate


def create_project(db: Session, project_data: ProjectCreate, user_id: str) -> Project:

    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        user_id=user_id,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def get_projects(db: Session, user_id: str):

    return (
        db.query(Project)
        .filter(Project.user_id == user_id)
        .order_by(Project.id.desc())
        .all()
    )


def update_project(db: Session, project_id: int, project_data: ProjectCreate, user_id: str):

    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )

    if not project:
        return None

    project.name = project_data.name
    project.description = project_data.description

    db.commit()
    db.refresh(project)

    return project


def delete_project(db: Session, project_id: int, user_id: str) -> bool:

    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )

    if not project:
        return False

    # Remove all image relationships belonging to this project.
    # This does NOT delete the actual images.
    db.query(ProjectImage).filter(
        ProjectImage.project_id == project_id
    ).delete(synchronize_session=False)

    # Now delete the project itself.
    db.delete(project)

    db.commit()

    return True


def add_image_to_project(db: Session, project_id: int, image_id: int, user_id: str) -> str:

    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        return "project_not_found"

    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        return "image_not_found"

    existing_link = (
        db.query(ProjectImage)
        .filter(
            ProjectImage.project_id == project_id,
            ProjectImage.image_id == image_id,
        )
        .first()
    )
    if existing_link:
        return "already_exists"

    new_link = ProjectImage(project_id=project_id, image_id=image_id)
    db.add(new_link)
    db.commit()

    return "created"


def get_project_images(db: Session, project_id: int, user_id: str):

    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        return None

    return (
        db.query(Image)
        .join(ProjectImage, ProjectImage.image_id == Image.id)
        .filter(ProjectImage.project_id == project_id)
        .order_by(Image.id.desc())
        .all()
    )


def remove_image_from_project(db: Session, project_id: int, image_id: int, user_id: str) -> bool:

    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        return False

    link = (
        db.query(ProjectImage)
        .filter(
            ProjectImage.project_id == project_id,
            ProjectImage.image_id == image_id,
        )
        .first()
    )

    if not link:
        return False

    db.delete(link)
    db.commit()

    return True