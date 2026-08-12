import { styles } from "./styles";

function EmptyProjectImages({ onGoToStudio }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIconBadge} className="cg-proj-empty-badge">
        📂
      </div>
      <div style={styles.emptyTitle}>No Images Yet</div>
      <div style={styles.emptyText}>
        Generate images and save them into this project.
      </div>
      <button
        style={styles.goToStudioBtn}
        className="cg-proj-primary-btn"
        onClick={onGoToStudio}
      >
        Go to AI Studio
      </button>
    </div>
  );
}

export default EmptyProjectImages;