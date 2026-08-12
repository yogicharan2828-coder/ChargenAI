import "./ImageGallery.css";
import { useEffect, useState } from "react";
import { downloadImage } from "../../utils/downloadImage";
import {
  toggleFavorite,
  getProjects,
  addImageToProject,
  deleteImage,
} from "../../api/ai";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import ImageViewer from "../ImageViewer/ImageViewer";

// --- "Save to Project" modal styles (premium redesign, UI only) ---
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(8, 8, 14, 0.72)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px",
};

const modalStyle = {
  background:
    "linear-gradient(180deg, rgba(32,32,44,0.9), rgba(18,18,26,0.92))",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "20px",
  padding: "28px",
  width: "380px",
  maxWidth: "100%",
  boxShadow:
    "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const modalHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "22px",
};

const modalIconBadgeStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "11px",
  background: "rgba(99,102,241,0.15)",
  border: "1px solid rgba(99,102,241,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
  color: "#ffffff",
  letterSpacing: "-0.01em",
};

const selectWrapperStyle = {
  position: "relative",
  marginBottom: "26px",
};

const selectStyle = {
  width: "100%",
  boxSizing: "border-box",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "12px 38px 12px 14px",
  color: "#ffffff",
  fontSize: "14px",
  fontFamily: "inherit",
  cursor: "pointer",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const selectArrowStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#a1a1aa",
  fontSize: "12px",
  pointerEvents: "none",
};

const modalActionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  borderTop: "1px solid rgba(255,255,255,0.07)",
  paddingTop: "20px",
};

const cancelBtnStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#d1d5db",
  borderRadius: "10px",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const saveBtnStyle = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  border: "none",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 22px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
};

// --- Three-dot dropdown menu styles (premium redesign, UI only) ---
const menuWrapperStyle = {
  position: "relative",
  display: "inline-block",
};

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  minWidth: "196px",
  background: "rgba(20, 20, 30, 0.96)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
  padding: "6px",
  zIndex: 50,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "9px 10px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "#e5e7eb",
  fontSize: "13.5px",
  fontFamily: "inherit",
  textAlign: "left",
  cursor: "pointer",
};

const menuItemDisabledStyle = {
  ...menuItemStyle,
  color: "rgba(229,231,235,0.35)",
  cursor: "not-allowed",
};

const menuDividerStyle = {
  height: "1px",
  background: "rgba(255,255,255,0.08)",
  margin: "6px 4px",
};

function ImageGallery({
  images,
  loading,
  showNotification,
  handleDownloadAll,
  handleOpenClearModal,
}) {
  const [favorites, setFavorites] = useState({});

  // --- Save to Project state (unchanged logic) ---
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Three-dot menu state ---
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- Image viewer (lightbox) state ---
  const [viewerImage, setViewerImage] = useState(null);

  // --- Delete confirmation state ---
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Locally-hidden image IDs. The backend record is actually deleted via
  // deleteImage(); this just lets the gallery update instantly without
  // requiring ImageGallery to own or re-fetch the images list itself.
  const [deletedIds, setDeletedIds] = useState(new Set());

  const visibleImages = images.filter((img) => !deletedIds.has(img.id));

  // Check if image has a real database ID
  const hasValidId = (id) => {
    return typeof id === "number" && id > 0;
  };
  // Sync favorite state whenever images change
  useEffect(() => {
    const initial = {};
    images.forEach((img) => {
      if (hasValidId(img.id)) {
        initial[img.id] = !!img.favorite;
      }
    });
    setFavorites(initial);
  }, [images]);

  // Close the open three-dot menu on any click/tap outside of it.
  useEffect(() => {
    if (openMenuId === null) return;

    const handleOutsideClick = (e) => {
      if (!e.target.closest(".image-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [openMenuId]);

  const handleFavorite = async (imageId) => {
    try {
      const result = await toggleFavorite(imageId);
      setFavorites((prev) => ({
        ...prev,
        [imageId]: result.favorite,
      }));
      showNotification(
        result.favorite
          ? "Added to Favorites ❤️"
          : "Removed from Favorites",
        result.favorite ? "success" : "error"
      );
    } catch {
      showNotification(
        "Failed to update favorite",
        "error"
      );
    }
  };

  // Opens the "Save to Project" modal for a specific image and loads
  // the current project list from the backend for the dropdown.
  const handleOpenSaveModal = async (imageId) => {
    setActiveImageId(imageId);
    setSelectedProjectId("");
    setShowSaveModal(true);
    setLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      showNotification("Failed to save image.", "error");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setActiveImageId(null);
    setSelectedProjectId("");
  };

  const handleSaveToProject = async () => {
    if (!selectedProjectId) {
      showNotification("Please select a project.", "error");
      return;
    }
    try {
      setIsSaving(true);
      await addImageToProject(selectedProjectId, activeImageId);
      showNotification("Image added to project successfully!", "success");
      setShowSaveModal(false);
      setActiveImageId(null);
      setSelectedProjectId("");
    } catch (error) {
      if (error.status === 400) {
        // Backend-provided message, e.g. "Image already exists in this project".
        // Modal stays open so the user can pick a different project.
        showNotification(error.message, "error");
      } else {
        showNotification("Failed to save image.", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- Three-dot menu handlers ---

  const handleToggleMenu = (imageId) => {
    setOpenMenuId((prev) => (prev === imageId ? null : imageId));
  };

  const handleViewImage = (img) => {
    setViewerImage(img);
    setOpenMenuId(null);
  };

  const handleCloseViewer = () => {
    setViewerImage(null);
  };

  const handleMenuDownload = (img) => {
    downloadImage(img.image_url);
    showNotification("Image downloaded successfully!", "success");
    setOpenMenuId(null);
  };

  const handleMenuFavorite = (imageId) => {
    handleFavorite(imageId);
    setOpenMenuId(null);
  };

  const handleMenuMoveToProject = (imageId) => {
    setOpenMenuId(null);
    handleOpenSaveModal(imageId);
  };

  const handleRequestDelete = (imageId) => {
    setImageToDelete(imageId);
    setOpenMenuId(null);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setImageToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete === null || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteImage(imageToDelete);
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.add(imageToDelete);
        return next;
      });
      showNotification("Image deleted successfully!", "success");
    } catch {
      showNotification("Failed to delete image.", "error");
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="generated-section">
      <style>{`
        .image-menu-item:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
        }
        .image-menu-item-danger {
          color: #f87171 !important;
        }
        .image-menu-item-danger:hover:not(:disabled) {
          background: rgba(248,113,113,0.12) !important;
          color: #fca5a5 !important;
        }
      `}</style>

      <div className="section-header">
        <h2>✨ Generated Images</h2>
        <div className="actions">
          <button onClick={handleDownloadAll}>
            Download All
          </button>
          <button onClick={handleOpenClearModal}>
            Clear All
          </button>
        </div>
      </div>
      <div className="image-grid">
        {loading ? (
          <>
            <div className="image-card skeleton-card"></div>
            <div className="image-card skeleton-card"></div>
            <div className="image-card skeleton-card"></div>
            <div className="image-card skeleton-card"></div>
          </>
        ) : (
          visibleImages.map((img, index) => {
            const validId = hasValidId(img.id);
            const isFavorited = validId && favorites[img.id];
            return (
              <div
                className="image-card"
                key={validId ? img.id : `placeholder-${index}`}
              >
                <img
                  src={img.image_url}
                  alt={`AI ${index + 1}`}
                  className="generated-image"
                />
                <div className="image-actions">
                  <button
                    title="Download"
                    onClick={() => {
                      downloadImage(img.image_url);
                      showNotification(
                        "Image downloaded successfully!",
                        "success"
                      );
                    }}
                  >
                    ⬇
                  </button>
                  <button
                    title={
                      validId
                        ? "Favorite"
                        : "Image loading..."
                    }
                    disabled={!validId}
                    onClick={() => {
                      if (validId) {
                        handleFavorite(img.id);
                      }
                    }}
                  >
                    {validId && favorites[img.id]
                      ? "❤️"
                      : "🤍"}
                  </button>

                  <button
                    title={validId ? "Save" : "Image loading..."}
                    disabled={!validId}
                    onClick={() => {
                      if (validId) {
                        handleOpenSaveModal(img.id);
                      }
                    }}
                  >
                    📁
                  </button>

                  <div className="image-menu" style={menuWrapperStyle}>
                    <button
                      title="More"
                      aria-haspopup="true"
                      aria-expanded={openMenuId === img.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu(img.id);
                      }}
                    >
                      ⋮
                    </button>

                    {openMenuId === img.id && (
                      <div className="image-menu-dropdown" style={dropdownStyle}>
                        <button
                          type="button"
                          className="image-menu-item"
                          style={menuItemStyle}
                          onClick={() => handleViewImage(img)}
                        >
                          👁 View Image
                        </button>

                        <button
                          type="button"
                          className="image-menu-item"
                          style={menuItemStyle}
                          onClick={() => handleMenuDownload(img)}
                        >
                          ⬇ Download
                        </button>

                        <button
                          type="button"
                          className="image-menu-item"
                          style={validId ? menuItemStyle : menuItemDisabledStyle}
                          disabled={!validId}
                          onClick={() =>
                            validId && handleMenuFavorite(img.id)
                          }
                        >
                          {isFavorited
                            ? "❤️ Remove from Favorites"
                            : "❤️ Add to Favorites"}
                        </button>

                        <button
                          type="button"
                          className="image-menu-item"
                          style={validId ? menuItemStyle : menuItemDisabledStyle}
                          disabled={!validId}
                          onClick={() =>
                            validId && handleMenuMoveToProject(img.id)
                          }
                        >
                          📁 Move to Project
                        </button>

                        <div style={menuDividerStyle} />

                        <button
                          type="button"
                          className="image-menu-item image-menu-item-danger"
                          style={validId ? menuItemStyle : menuItemDisabledStyle}
                          disabled={!validId}
                          onClick={() =>
                            validId && handleRequestDelete(img.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {viewerImage && (
        <ImageViewer image={viewerImage} onClose={handleCloseViewer} />
      )}

      <ConfirmModal
        isOpen={imageToDelete !== null}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {showSaveModal && (
        <div className="save-modal-overlay" style={overlayStyle}>
          <style>{`
            @keyframes saveModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes saveModalScaleIn {
              from { opacity: 0; transform: translateY(10px) scale(0.96); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .save-modal-overlay { animation: saveModalFadeIn 0.18s ease-out; }
            .save-modal-box { animation: saveModalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
            .save-modal-select:focus {
              border-color: rgba(139, 92, 246, 0.55) !important;
              box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
            }
            .save-modal-select:disabled { opacity: 0.5; cursor: not-allowed; }
            .save-modal-cancel-btn { transition: background 0.15s ease, border-color 0.15s ease; }
            .save-modal-cancel-btn:hover:not(:disabled) {
              background: rgba(255,255,255,0.07);
              border-color: rgba(255,255,255,0.25);
            }
            .save-modal-save-btn { transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease; }
            .save-modal-save-btn:hover:not(:disabled) {
              transform: translateY(-1px);
              box-shadow: 0 8px 22px rgba(99,102,241,0.45);
              filter: brightness(1.05);
            }
            .save-modal-save-btn:disabled,
            .save-modal-cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            @media (max-width: 480px) {
              .save-modal-box { width: 100% !important; padding: 22px !important; }
            }
          `}</style>
          <div className="save-modal-box" style={modalStyle}>
            <div style={modalHeaderStyle}>
              <span style={modalIconBadgeStyle}>📁</span>
              <h3 style={modalTitleStyle}>Save to Project</h3>
            </div>

            <div style={selectWrapperStyle}>
              <select
                className="save-modal-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={selectStyle}
                disabled={loadingProjects || isSaving}
              >
                <option value="" style={{ background: "#1a1a24", color: "#fff" }}>
                  {loadingProjects ? "Loading projects..." : "Select a project"}
                </option>
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    style={{ background: "#1a1a24", color: "#fff" }}
                  >
                    {project.name ?? project.title ?? `Project ${project.id}`}
                  </option>
                ))}
              </select>
              <span style={selectArrowStyle}>▾</span>
            </div>

            <div style={modalActionsStyle}>
              <button
                className="save-modal-cancel-btn"
                style={cancelBtnStyle}
                onClick={handleCloseSaveModal}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="save-modal-save-btn"
                style={saveBtnStyle}
                onClick={handleSaveToProject}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ImageGallery;