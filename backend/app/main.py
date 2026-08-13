import os
import mimetypes
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.project import router as project_router
from app.api.profile import router as profile_router
from app.api.image import router as image_router
from app.database.db import Base, engine
from app.models.image_model import Image
from app.models.project_model import Project
from app.models.project_image_model import ProjectImage
from app.auth.auth import get_current_user  # noqa: F401 - not applied to any route yet

app = FastAPI(
    title="CharGen AI",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://chargeniai.netlify.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
Base.metadata.create_all(bind=engine)
app.include_router(image_router)
app.include_router(project_router)
app.include_router(profile_router)
@app.get("/")
def home():
    return {
        "message": "Welcome to CharGen AI Backend 🚀"
    }


@app.get("/download/{filename}")
def download_image(filename: str):
    # Reject any path traversal attempt outright before touching the filesystem.
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    # Strip to a bare filename as a second layer of defense.
    safe_filename = os.path.basename(filename)
    if not safe_filename or safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Third layer: resolve real paths and confirm the file is still
    # actually inside UPLOAD_DIR, in case of symlinks or edge cases.
    upload_dir_real = os.path.realpath(UPLOAD_DIR)
    file_path_real = os.path.realpath(file_path)
    if os.path.commonpath([upload_dir_real, file_path_real]) != upload_dir_real:
        raise HTTPException(status_code=400, detail="Invalid filename")

    if not os.path.isfile(file_path_real):
        raise HTTPException(status_code=404, detail="File not found")

    media_type, _ = mimetypes.guess_type(file_path_real)
    if media_type is None:
        media_type = "application/octet-stream"

    return FileResponse(
        path=file_path_real,
        media_type=media_type,
        filename=safe_filename,
    )