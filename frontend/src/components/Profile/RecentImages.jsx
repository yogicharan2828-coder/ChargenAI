import { useState } from "react";
import { styles } from "./styles";

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecentImages({ images }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
   <div className="profile-section profile-images-section" style={styles.section}>
      <h2 style={styles.sectionTitle}>Recent Images</h2>

      {images && images.length > 0 ? (
        <div className="profile-image-grid" style={styles.imageGrid}>
          {images.map((image) => {
            const isHovered = hoveredId === image.id;
            return (
              <div
                style={styles.imageCard(isHovered)}
                key={image.id}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={styles.imagePreviewWrap}>
                  <img
                   src={image.image_url}
                    alt={image.prompt || "Generated image"}
                    style={styles.imagePreview(isHovered)}
                  />
                </div>
                <div style={styles.imageCardBody}>
                  <div style={styles.imagePrompt}>{image.prompt}</div>
                  <div style={styles.imageCardDate}>
                    {formatDate(image.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBadge}>🖼</div>
          <div style={styles.emptyTitle}>No recent images</div>
          <div style={styles.emptyText}>
            Images you generate will show up here.
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentImages;