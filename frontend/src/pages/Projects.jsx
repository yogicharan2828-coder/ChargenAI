import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import ProjectCard from "../components/Projects/ProjectCard";
import ProjectModal from "../components/Projects/ProjectModal";
import ProjectDetails from "../components/Projects/ProjectDetails";
import EmptyProjects from "../components/Projects/EmptyProjects";
import ProjectSkeleton from "../components/Projects/ProjectSkeleton";
import { styles } from "../components/Projects/styles";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectImages,
  removeImageFromProject,
} from "../api/ai";
import { downloadImage } from "../utils/downloadImage"; // adjust path if your utility lives elsewhere

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProject, setEditingProject] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectPendingDelete, setProjectPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---- Detail view state ----
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectImages, setProjectImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // ---- Remove-image confirm modal state ----
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [imagePendingRemove, setImagePendingRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingProject(null);
    setFormName("");
    setFormDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode("edit");
    setEditingProject(project);
    setFormName(project.name || "");
    setFormDescription(project.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormName("");
    setFormDescription("");
  };

  const handleModalSubmit = async () => {
    if (!formName.trim()) {
      showNotification("Project name is required.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      if (modalMode === "create") {
        await createProject({
          name: formName.trim(),
          description: formDescription.trim(),
        });
        showNotification("Project created successfully!", "success");
      } else {
        await updateProject(editingProject.id, {
          name: formName.trim(),
          description: formDescription.trim(),
        });
        showNotification("Project updated successfully!", "success");
      }

      closeModal();
      await loadProjects();
    } catch (error) {
      console.error(error);
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (project) => {
    setProjectPendingDelete(project);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProjectPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!projectPendingDelete) return;

    try {
      setIsDeleting(true);
      await deleteProject(projectPendingDelete.id);
      showNotification("Project deleted successfully!", "success");
      setShowDeleteModal(false);
      setProjectPendingDelete(null);
      await loadProjects();
    } catch (error) {
      console.error(error);
      showNotification("Failed to delete project.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---- Detail view handlers ----

  const loadProjectImages = async (projectId) => {
    try {
      setImagesLoading(true);
      const data = await getProjectImages(projectId);
      setProjectImages(data);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load project images.", "error");
    } finally {
      setImagesLoading(false);
    }
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setProjectImages([]);
    loadProjectImages(project.id);
  };

  const backToProjectList = () => {
    setSelectedProject(null);
    setProjectImages([]);
    setImagesLoading(false);
  };

  const handleGoToStudio = () => {
    navigate("/studio");
  };

  // Reuse the existing download utility used elsewhere in the app
  // instead of re-implementing download logic here.
  const handleDownload = (image) => {
    downloadImage(image);
  };

  const openRemoveModal = (image) => {
    setImagePendingRemove(image);
    setShowRemoveModal(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setImagePendingRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (!imagePendingRemove || !selectedProject) return;

    try {
      setIsRemoving(true);
      await removeImageFromProject(selectedProject.id, imagePendingRemove.id);
      showNotification("Image removed from project.", "success");
      setShowRemoveModal(false);
      setImagePendingRemove(null);
      await loadProjectImages(selectedProject.id);
    } catch (error) {
      console.error(error);
      showNotification("Failed to remove image from project.", "error");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div style={styles.page} className="cg-proj-page">
      <style>{`
        @keyframes cgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cgScaleIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cgShimmer {
          0% { background-position: -150% 0; }
          100% { background-position: 150% 0; }
        }
        @keyframes cgPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        .cg-proj-primary-btn { transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease; }
        .cg-proj-primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(99,102,241,0.45);
          filter: brightness(1.06);
        }
        .cg-proj-primary-btn:active:not(:disabled) { transform: translateY(0); }
        .cg-proj-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cg-proj-edit-btn, .cg-proj-delete-btn, .cg-proj-cancel-btn, .cg-proj-back-btn, .cg-proj-download-btn, .cg-proj-remove-btn {
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .cg-proj-edit-btn:hover { background: rgba(99,102,241,0.22); border-color: rgba(99,102,241,0.55); }
        .cg-proj-delete-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.55); }
        .cg-proj-cancel-btn:hover:not(:disabled) { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.3); }
        .cg-proj-cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cg-proj-back-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.28); }
        .cg-proj-download-btn:hover { background: rgba(99,102,241,0.22); border-color: rgba(99,102,241,0.55); }
        .cg-proj-remove-btn:hover:not(:disabled) { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.55); }
        .cg-proj-remove-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cg-proj-input:focus, .cg-proj-textarea:focus {
          border-color: rgba(139,92,246,0.55) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }

        .cg-proj-skeleton { position: relative; overflow: hidden; }
        .cg-proj-skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          background-size: 200% 100%;
          animation: cgShimmer 1.6s ease-in-out infinite;
        }

        .cg-proj-modal-overlay { animation: cgFadeIn 0.18s ease-out; }
        .cg-proj-modal-box { animation: cgScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
        .cg-proj-empty-badge { animation: cgPulse 3s ease-in-out infinite; }
@media (max-width: 480px) {
  .cg-proj-page {
    padding: 14px !important;
    width: 100%;
    box-sizing: border-box;
  }

  /* Main project cards */
  .cg-proj-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
    width: 100%;
  }

  /* Project detail image grid */
  .cg-proj-image-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    width: 100%;
  }

  /* Project creation/edit modal */
  .cg-proj-modal-box {
    width: 100% !important;
    max-width: 100% !important;
    padding: 20px !important;
    box-sizing: border-box;
  }

  /* Detail back button area */
  .cg-proj-detail-topbar {
    flex-direction: row !important;
    align-items: center !important;
    margin-bottom: 16px !important;
  }

  /* Project detail information */
  .cg-proj-detail-topbar + div {
    width: 100%;
    box-sizing: border-box;
  }

  /* Make project buttons comfortable to tap */
  .cg-proj-edit-btn,
  .cg-proj-delete-btn,
  .cg-proj-back-btn,
  .cg-proj-download-btn,
  .cg-proj-remove-btn {
    min-height: 42px !important;
  }
}

@media (max-width: 375px) {
  .cg-proj-page {
    padding: 12px !important;
  }

  .cg-proj-grid {
    gap: 12px !important;
  }

  .cg-proj-image-grid {
    gap: 14px !important;
  }

  .cg-proj-modal-box {
    padding: 18px !important;
  }

  .cg-proj-edit-btn,
  .cg-proj-delete-btn,
  .cg-proj-back-btn,
  .cg-proj-download-btn,
  .cg-proj-remove-btn {
    min-height: 40px !important;
  }
}
      `}</style>

      <Toast show={showToast} message={toastMessage} type={toastType} />

      {selectedProject === null ? (
        <>
          <Header
            title="Projects"
            subtitle="Organize and manage your AI creations"
          />

          <div style={styles.topBar}>
            <button
              style={styles.newProjectBtn}
              className="cg-proj-primary-btn"
              onClick={openCreateModal}
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <ProjectSkeleton gridClassName="cg-proj-grid" />
          ) : projects.length === 0 ? (
            <EmptyProjects onCreateClick={openCreateModal} />
          ) : (
            <div style={styles.grid} className="cg-proj-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isHovered={hoveredId === project.id}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onOpen={() => openProjectDetails(project)}
                  onEdit={() => openEditModal(project)}
                  onDelete={() => openDeleteModal(project)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ProjectDetails
          project={selectedProject}
          images={projectImages}
          imagesLoading={imagesLoading}
          onBack={backToProjectList}
          onDownloadImage={handleDownload}
          onRemoveImage={openRemoveModal}
          onGoToStudio={handleGoToStudio}
        />
      )}

      <ProjectModal
        isOpen={isModalOpen}
        mode={modalMode}
        name={formName}
        description={formDescription}
        onNameChange={setFormName}
        onDescriptionChange={setFormDescription}
        onCancel={closeModal}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ConfirmModal
        isOpen={showRemoveModal}
        title="Remove Image"
        message="Remove this image from the project?"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}
export default Projects;