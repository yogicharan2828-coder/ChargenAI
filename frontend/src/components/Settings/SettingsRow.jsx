import { useState } from "react";
import { styles } from "./styles";

function SettingsRow({ icon, label, description, onClick, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const clickable = typeof onClick === "function";

  return (
    <div
      className="settings-row"
      style={styles.row(isHovered, clickable)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="settings-row-left"
        style={styles.rowLeft}
      >
        <span style={styles.rowIcon}>{icon}</span>

        <div>
          <div
            className="settings-row-label"
            style={styles.rowLabel}
          >
            {label}
          </div>

          {description && (
            <div style={styles.rowDescription}>
              {description}
            </div>
          )}
        </div>
      </div>

      <div
        className="settings-row-right"
        style={styles.rowRight}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default SettingsRow;