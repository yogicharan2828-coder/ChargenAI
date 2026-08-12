import { useState } from "react";
import { styles } from "./styles";

function ProfileHeader({ name, subtitle, membership }) {
  const [isHovered, setIsHovered] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      style={styles.headerCard(isHovered)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.avatarCircle}>{initial}</div>
      <div style={styles.headerTextBlock}>
        <h1 style={styles.nameText}>{name}</h1>
        <p style={styles.subtitleText}>{subtitle}</p>
        <span style={styles.membershipBadge}>{membership}</span>
      </div>
    </div>
  );
}

export default ProfileHeader;