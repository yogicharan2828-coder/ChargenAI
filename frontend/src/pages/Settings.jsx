import { useState, useRef } from "react";
import SettingsSection from "../components/Settings/SettingsSection";
import SettingsRow from "../components/Settings/SettingsRow";
import { styles } from "../components/Settings/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../components/settings/settings.css";

const THEME_OPTIONS = [
  { key: "dark", icon: "🌙", label: "Dark Mode" },
  { key: "light", icon: "☀️", label: "Light Mode" },
  { key: "system", icon: "💻", label: "System Default" },
];

function Settings() {
  const [theme, setTheme] = useState("dark");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [language, setLanguage] = useState("english");
  const [toastMessage, setToastMessage] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const toastTimerRef = useRef(null);
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  function showToast(message) {
    setToastMessage(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }

  function handleComingSoon() {
    showToast("Feature coming soon 🚀");
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      className="settings-page"
      style={styles.page}
    >
      {/* ---- Page Header ---- */}

      <h1
        className="settings-page-title"
        style={styles.pageTitle}
      >
        Settings
      </h1>

      <p
        className="settings-page-subtitle"
        style={styles.pageSubtitle}
      >
        Manage your appearance, preferences, and account.
      </p>

      {/* ---- Appearance ---- */}

      <SettingsSection title="Appearance">
        {THEME_OPTIONS.map((option) => (
          <SettingsRow
            key={option.key}
            icon={option.icon}
            label={option.label}
            onClick={() => setTheme(option.key)}
          >
            <span
              style={styles.selectedBadge(
                theme === option.key
              )}
            >
              {theme === option.key
                ? "Selected"
                : "Select"}
            </span>
          </SettingsRow>
        ))}
      </SettingsSection>

      {/* ---- Preferences ---- */}

      <SettingsSection title="Preferences">
        <SettingsRow
          icon="🔔"
          label="Notifications"
        >
          <div
            style={styles.toggleTrack(notificationsOn)}
            onClick={() =>
              setNotificationsOn((prev) => !prev)
            }
          >
            <div
              style={styles.toggleThumb(notificationsOn)}
            />
          </div>
        </SettingsRow>

        <SettingsRow
          icon="🌐"
          label="Language"
        >
          <select
            style={styles.select}
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option value="english">
              English
            </option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* ---- Account ---- */}

      <SettingsSection title="Account">
        <SettingsRow
          icon="👤"
          label="Edit Profile"
          onClick={handleComingSoon}
        >
          <button
            type="button"
            style={styles.actionBtn(
              hoveredAction === "edit"
            )}
            onMouseEnter={() =>
              setHoveredAction("edit")
            }
            onMouseLeave={() =>
              setHoveredAction(null)
            }
            onClick={handleComingSoon}
          >
            Coming Soon
          </button>
        </SettingsRow>

        <SettingsRow
          icon="🔐"
          label="Change Password"
          onClick={handleComingSoon}
        >
          <button
            type="button"
            style={styles.actionBtn(
              hoveredAction === "password"
            )}
            onMouseEnter={() =>
              setHoveredAction("password")
            }
            onMouseLeave={() =>
              setHoveredAction(null)
            }
            onClick={handleComingSoon}
          >
            Coming Soon
          </button>
        </SettingsRow>

        {/* Logout ONLY appears when logged in */}

        {user && (
          <SettingsRow
            icon="🚪"
            label="Logout"
          >
            <button
              type="button"
              style={styles.logoutBtn(
                hoveredAction === "logout"
              )}
              onMouseEnter={() =>
                setHoveredAction("logout")
              }
              onMouseLeave={() =>
                setHoveredAction(null)
              }
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>
          </SettingsRow>
        )}
      </SettingsSection>

      {/* ---- About ---- */}

      <SettingsSection title="About">
        <div
          className="settings-about-block"
          style={styles.aboutBlock}
        >
          <div style={styles.aboutName}>
            CharGen AI
          </div>

          <div
            className="settings-about-text"
            style={styles.aboutText}
          >
            AI-powered image generation and creative
            workspace.
          </div>

          <div
            className="settings-about-meta"
            style={styles.aboutMetaRow}
          >
            <span
              className="settings-about-tag"
              style={styles.aboutTag}
            >
              v1.0.0
            </span>

            <span
              className="settings-about-tag"
              style={styles.aboutTag}
            >
              Portfolio Project
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* ---- Toast ---- */}

      {toastMessage && (
        <div
          className="settings-toast-wrap"
          style={styles.toastWrap}
        >
          <div
            className="settings-toast"
            style={styles.toast}
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;