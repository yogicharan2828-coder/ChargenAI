import { styles } from "./styles";

function ProjectCard({
  project,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpen,
  onEdit,
  onDelete,
  formatDate,
}) {
  return (
    <div
      style={styles.card(isHovered)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onOpen}
    >
      <div style={styles.cardHeader}>
        <span style={styles.cardIconBadge}>📁</span>
        <h3 style={styles.cardName}>{project.name}</h3>
      </div>
      <div style={styles.cardDescription}>
        {project.description || "No description provided."}
      </div>
      <div style={styles.cardDate}>
        Created {formatDate(project.created_at)}
      </div>
      <div style={styles.cardActions} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.editBtn}
          className="cg-proj-edit-btn"
          onClick={onEdit}
        >
          ✏️ Edit
        </button>
        <button
          style={styles.deleteBtn}
          className="cg-proj-delete-btn"
          onClick={onDelete}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;