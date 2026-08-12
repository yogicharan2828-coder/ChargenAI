import { styles } from "./styles";

function ProjectModal({
  isOpen,
  mode,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onCancel,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={styles.modalOverlay}
      className="cg-proj-modal-overlay"
      onClick={onCancel}
    >
      <div
        style={styles.modalBox}
        className="cg-proj-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalTitle}>
          {mode === "create" ? "New Project" : "Edit Project"}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Project Name</label>
          <input
            type="text"
            style={styles.input}
            className="cg-proj-input"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Portrait Series"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            className="cg-proj-textarea"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What is this project about?"
          />
        </div>

        <div style={styles.modalActions}>
          <button
            style={styles.cancelBtn}
            className="cg-proj-cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            style={styles.submitBtn}
            className="cg-proj-primary-btn"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;