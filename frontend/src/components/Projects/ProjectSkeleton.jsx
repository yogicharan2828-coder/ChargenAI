import { styles } from "./styles";

function ProjectSkeleton({ gridClassName = "cg-proj-grid", count = 4 }) {
  return (
    <div style={styles.loadingWrap} className={gridClassName}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={styles.skeletonCard}
          className="cg-proj-skeleton"
        ></div>
      ))}
    </div>
  );
}

export default ProjectSkeleton;