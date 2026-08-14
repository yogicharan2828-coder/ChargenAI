import { styles } from "./styles";

function SettingsSection({ title, children }) {
  return (
    <div
      className="settings-section"
      style={styles.section}
    >
      <div
        className="settings-section-card"
        style={styles.sectionCard}
      >
        <div
          className="settings-section-title"
          style={styles.sectionTitle}
        >
          {title}
        </div>

        {children}
      </div>
    </div>
  );
}

export default SettingsSection;