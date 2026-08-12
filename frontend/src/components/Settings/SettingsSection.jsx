import { styles } from "./styles";

function SettingsSection({ title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionCard}>
        <div style={styles.sectionTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export default SettingsSection;