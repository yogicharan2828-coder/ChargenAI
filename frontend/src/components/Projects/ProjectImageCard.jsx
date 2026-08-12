import { styles } from "./styles";

function ProjectImageCard({ image, onDownload, onRemove }) {
  return (
    <div style={styles.imageCard}>
      <div style={styles.imagePreviewWrap}>
        <img
          src={image.url || image.image_url || image.src}
          alt={image.prompt || "Generated image"}
          style={styles.imagePreview}
        />
      </div>
      <div style={styles.imageCardBody}>
        <div style={styles.imagePrompt}>
          {image.prompt || "No prompt available."}
        </div>
        <div style={styles.imageCardActions}>
          <button
            style={styles.downloadBtn}
            className="cg-proj-download-btn"
            onClick={onDownload}
          >
            ⬇️ Download
          </button>
          <button
            style={styles.removeBtn}
            className="cg-proj-remove-btn"
            onClick={onRemove}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectImageCard;