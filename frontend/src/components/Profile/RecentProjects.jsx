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

function RecentProjects({ projects }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
   <div className="profile-section profile-projects-section" style={styles.section}>
      <h2 style={styles.sectionTitle}>Recent Projects</h2>

      {projects && projects.length > 0 ? (
      <div className="profile-project-grid" style={styles.projectGrid}>
          {projects.map((project) => (
            <div
              style={styles.projectCard(hoveredId === project.id)}
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={styles.projectCardHeader}>
                <span style={styles.projectIconBadge}>📁</span>
                <h3 style={styles.projectName}>{project.name}</h3>
              </div>
              <div style={styles.projectDescription}>
                {project.description || "No description provided."}
              </div>
              <div style={styles.projectDate}>
                Created {formatDate(project.created_at)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBadge}>📁</div>
          <div style={styles.emptyTitle}>No recent projects</div>
          <div style={styles.emptyText}>
            Projects you create will show up here.
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentProjects;