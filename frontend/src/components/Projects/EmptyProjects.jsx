import { styles } from "./styles";

function EmptyProjects({ onCreateClick }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIconBadge} className="cg-proj-empty-badge">
        📂
      </div>
      <div style={styles.emptyTitle}>No Projects Yet</div>
      <div style={styles.emptyText}>
        Create your first project to organize your AI-generated images.
      </div>
      <button
        style={styles.newProjectBtn}
        className="cg-proj-primary-btn"
        onClick={onCreateClick}
      >
        Create Project
      </button>
    </div>
  );
}

export default EmptyProjects;