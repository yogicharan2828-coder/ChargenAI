import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { getImages, getProjects } from "../../api/ai";
import { useAuth } from "../../auth/AuthContext";

const MONTH_NAMES = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseSearchDate(rawQuery) {
  const trimmed = rawQuery.trim();

  if (!trimmed) return null;

  let match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    return {
      year: Number(match[1]),
      month: Number(match[2]) - 1,
      day: Number(match[3]),
    };
  }

  match = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  );

  if (match) {
    return {
      year: Number(match[3]),
      month: Number(match[1]) - 1,
      day: Number(match[2]),
    };
  }

  match = trimmed.match(
    /^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/
  );

  if (match) {
    const month = MONTH_NAMES[match[1].toLowerCase()];

    if (month === undefined) return null;

    return {
      year: Number(match[3]),
      month,
      day: Number(match[2]),
    };
  }

  return null;
}

function getCalendarDateParts(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return null;

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

function matchesDate(createdAt, searchedDateParts) {
  if (!searchedDateParts) return false;

  const created = getCalendarDateParts(createdAt);

  if (!created) return false;

  return (
    created.year === searchedDateParts.year &&
    created.month === searchedDateParts.month &&
    created.day === searchedDateParts.day
  );
}

const MAX_RESULTS_PER_SECTION = 5;

function Navbar() {
  const navigate = useNavigate();

  const searchContainerRef = useRef(null);
  const profileContainerRef = useRef(null);

  const { user, signOut } = useAuth();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ---------------------------------------
  // SEARCH DATA
  // ---------------------------------------

  useEffect(() => {
    let isMounted = true;

    async function loadSearchData() {
      const [imagesResult, projectsResult] =
        await Promise.allSettled([
          getImages(),
          getProjects(),
        ]);

      if (!isMounted) return;

      if (imagesResult.status === "fulfilled") {
        setImages(imagesResult.value || []);
      } else {
        console.error(
          "Search: failed to load images",
          imagesResult.reason
        );
      }

      if (projectsResult.status === "fulfilled") {
        setProjects(projectsResult.value || []);
      } else {
        console.error(
          "Search: failed to load projects",
          projectsResult.reason
        );
      }
    }

    loadSearchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------
  // CLOSE SEARCH ON OUTSIDE CLICK
  // ---------------------------------------

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }

      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------

  function handleQueryChange(e) {
    const value = e.target.value;

    setQuery(value);
    setIsOpen(value.trim().length > 0);
  }

  function handleFocus() {
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function closeAndClear() {
    setQuery("");
    setIsOpen(false);
  }

  function handleImageResultClick() {
    closeAndClear();
    navigate("/history");
  }

  function handleProjectResultClick() {
    closeAndClear();
    navigate("/projects");
  }

  function handleViewAll(path) {
    closeAndClear();
    navigate(path);
  }

  // ---------------------------------------
  // PROFILE / AUTH
  // ---------------------------------------

  function getUserName() {
    if (!user) return "";

    return (
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User"
    );
  }

  function getInitials() {
    const name = getUserName();

    if (!name) return "YC";

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }

  function handleProfileClick() {
    setProfileOpen(false);
    navigate("/profile");
  }

  function handleSettingsClick() {
    setProfileOpen(false);
    navigate("/settings");
  }

  function handleLoginClick() {
    setProfileOpen(false);
    navigate("/login");
  }

  function handleSignupClick() {
    setProfileOpen(false);
    navigate("/signup");
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut();

      setProfileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searchedDateParts = parseSearchDate(query);

  const filteredImages = normalizedQuery
    ? images.filter((img) => {
        const promptMatch = (img.prompt || "")
          .toLowerCase()
          .includes(normalizedQuery);

        const dateMatch = matchesDate(
          img.created_at,
          searchedDateParts
        );

        return promptMatch || dateMatch;
      })
    : [];

  const filteredProjects = normalizedQuery
    ? projects.filter((proj) =>
        (proj.name || "")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : [];

  const visibleImages = filteredImages.slice(
    0,
    MAX_RESULTS_PER_SECTION
  );

  const visibleProjects = filteredProjects.slice(
    0,
    MAX_RESULTS_PER_SECTION
  );

  const hasAnyResults =
    filteredImages.length > 0 ||
    filteredProjects.length > 0;

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <header className="navbar">

      <div className="logo">
        <span className="logo-gradient">
          CharGen
        </span>
        <span> AI</span>
      </div>

      {/* SEARCH */}

      <div
        className="search"
        ref={searchContainerRef}
      >
        <input
          type="text"
          placeholder="Search generations..."
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />

        {isOpen && (
          <div className="search-dropdown">

            {hasAnyResults ? (
              <>
                {visibleImages.length > 0 && (
                  <div className="search-section">

                    <div className="search-section-title">
                      Generated Images
                    </div>

                    {visibleImages.map((img) => (
                      <div
                        key={img.id}
                        className="search-result-item"
                        onClick={handleImageResultClick}
                      >
                        <img
                          src={img.image_url}
                          alt={
                            img.prompt ||
                            "Generated image"
                          }
                          className="search-result-thumb"
                        />

                        <span className="search-result-text">
                          {img.prompt}
                        </span>
                      </div>
                    ))}

                    {filteredImages.length >
                      MAX_RESULTS_PER_SECTION && (
                      <div
                        className="search-view-all"
                        onClick={() =>
                          handleViewAll("/history")
                        }
                      >
                        View all results →
                      </div>
                    )}

                  </div>
                )}

                {visibleProjects.length > 0 && (
                  <div className="search-section">

                    <div className="search-section-title">
                      Projects
                    </div>

                    {visibleProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="search-result-item"
                        onClick={handleProjectResultClick}
                      >
                        <span className="search-result-icon">
                          📁
                        </span>

                        <div className="search-result-text-block">

                          <span className="search-result-text">
                            {proj.name}
                          </span>

                          {proj.description && (
                            <span className="search-result-subtext">
                              {proj.description}
                            </span>
                          )}

                        </div>
                      </div>
                    ))}

                    {filteredProjects.length >
                      MAX_RESULTS_PER_SECTION && (
                      <div
                        className="search-view-all"
                        onClick={() =>
                          handleViewAll("/projects")
                        }
                      >
                        View all results →
                      </div>
                    )}

                  </div>
                )}
              </>
            ) : (
              <div className="search-empty">
                No results found
              </div>
            )}

          </div>
        )}
      </div>

      {/* RIGHT NAV */}

      <div className="nav-right">

        <button
          className="upgrade-btn"
          onClick={() => navigate("/upgrade")}
        >
          Upgrade
        </button>

        {/* PROFILE */}

        <div
          className="profile-container"
          ref={profileContainerRef}
        >

         <button
  type="button"
  className={`avatar ${
    !user ? "login-avatar" : ""
  } ${profileOpen ? "avatar-active" : ""}`}
  onClick={() =>
    setProfileOpen((prev) => !prev)
  }
  aria-label={user ? "Open profile menu" : "Login"}
>
  {user ? getInitials() : "Login"}
</button>

          {profileOpen && (
            <div className="profile-dropdown">

              {user ? (
                <>
                  <div className="profile-header">

                    <div className="profile-avatar-large">
                      {getInitials()}
                    </div>

                    <div className="profile-user-info">

                      <strong>
                        {getUserName()}
                      </strong>

                      <span>
                        {user.email}
                      </span>

                    </div>

                  </div>

                  <div className="profile-divider" />

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={handleProfileClick}
                  >
                    <span>👤</span>
                    Profile
                  </button>

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={handleSettingsClick}
                  >
                    <span>⚙️</span>
                    Settings
                  </button>
                  <div className="profile-divider" />
                  <button
                    type="button"
                    className="profile-menu-item logout"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <span>🚪</span>
                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      user
                    </div>
                    <div className="profile-user-info">
                      <strong>
                        Welcome to CharGen AI
                      </strong>
                      <span>
                        Sign in to save your creations
                      </span>
                    </div>
                  </div>
                  <div className="profile-divider" />
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={handleLoginClick}
                  >
                    <span>🔐</span>
                    Login
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={handleSignupClick}
                  >
                    <span>✨</span>
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;