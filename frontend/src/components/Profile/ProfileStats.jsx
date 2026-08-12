import { useState } from "react";
import { styles } from "./styles";

function formatMemberSince(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function ProfileStats({ imagesGenerated, favoritesCount, projectsCount, memberSince }) {
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const stats = [
    { icon: "🖼", label: "Images Generated", value: imagesGenerated ?? 0 },
    { icon: "❤️", label: "Favorites", value: favoritesCount ?? 0 },
    { icon: "📁", label: "Projects", value: projectsCount ?? 0 },
    { icon: "⭐", label: "Member Since", value: formatMemberSince(memberSince) },
  ];

  return (
    <div style={styles.statsGrid}>
      {stats.map((stat) => (
        <div
          style={styles.statCard(hoveredLabel === stat.label)}
          key={stat.label}
          onMouseEnter={() => setHoveredLabel(stat.label)}
          onMouseLeave={() => setHoveredLabel(null)}
        >
          <span style={styles.statIconBadge}>{stat.icon}</span>
          <div style={styles.statTextBlock}>
            <span style={styles.statValue}>{stat.value}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;