import { styles } from "./styles";
import ProjectImageCard from "./ProjectImageCard";
import EmptyProjectImages from "./EmptyProjectImages";
import ProjectSkeleton from "./ProjectSkeleton";

function ProjectDetails({
  project,
  images,
  imagesLoading,
  onBack,
  onDownloadImage,
  onRemoveImage,
  onGoToStudio,
}) {
  return (
    <>
      <div style={styles.detailTopBar} className="cg-proj-detail-topbar">
        <button
          style={styles.backBtn}
          className="cg-proj-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      <div style={styles.detailHeaderBlock}>
        <h2 style={styles.detailName}>{project.name}</h2>
        <div style={styles.detailDescription}>
          {project.description || "No description provided."}
        </div>
        <span style={styles.detailCount}>
          {images.length} {images.length === 1 ? "Image" : "Images"}
        </span>
      </div>

      {imagesLoading ? (
        <ProjectSkeleton gridClassName="cg-proj-image-grid" />
      ) : images.length === 0 ? (
        <EmptyProjectImages onGoToStudio={onGoToStudio} />
      ) : (
        <div style={styles.imageGrid} className="cg-proj-image-grid">
          {images.map((image) => (
            <ProjectImageCard
              key={image.id}
              image={image}
              onDownload={() => onDownloadImage(image)}
              onRemove={() => onRemoveImage(image)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ProjectDetails;