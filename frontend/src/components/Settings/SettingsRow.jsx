import { useState } from "react";
import { styles } from "./styles";

function SettingsRow({ icon, label, description, onClick, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const clickable = typeof onClick === "function";

  return (
    <div
      style={styles.row(isHovered, clickable)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={styles.rowLeft}>
        <span style={styles.rowIcon}>{icon}</span>
        <div>
          <div style={styles.rowLabel}>{label}</div>
          {description && (
            <div style={styles.rowDescription}>{description}</div>
          )}
        </div>
      </div>
      <div style={styles.rowRight} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default SettingsRow;