import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getImages, getFavorites, getProjects } from "../api/ai";
import { downloadImage } from "../utils/downloadImage";
function Dashboard() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [projects, setProjects] = useState([]);


  useEffect(() => {
  const loadDashboard = async () => {
    try {
     const [imagesData, favoritesData, projectsData] = await Promise.all([
  getImages(),
  getFavorites(),
  getProjects(),

]);
      const mapped = imagesData.map((img) => ({
        id: img.id,
        prompt: img.prompt,
        image: img.image_url,
        style: img.style,
        ratio: img.aspect_ratio,
        createdAt: img.created_at,
      }));

      setImages(mapped);
      setFavorites(favoritesData);
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
    }
  };

  loadDashboard();
}, []);

  const handleDownload = async (item) => {
  try {
    await downloadImage(item.image);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download image. Please try again.");
  }
};

  const today = new Date().toDateString();
  const todayImages = images.filter(
    (item) => new Date(item.createdAt).toDateString() === today
  );
  return (
    <div className="dashboard">
      <div className="hero">
        <div className="hero-section">
  <div>
    <span className="hero-badge">✨ AI Workspace</span>
    <h1 className="hero-title">
      Welcome Back <span>👋</span>
    </h1>
    <p className="hero-subtitle">
      Turn your imagination into breathtaking AI artwork.
      Manage your creations, favorites and projects from one place.
    </p>
    <button
      className="hero-btn"
      onClick={() => navigate("/studio")}
    >
      ✨ Generate New Image
    </button>
  </div>
  <div className="hero-glow"></div>
</div>
      </div>
      {/* Stats */}
<div className="stats-grid">
  <div className="stat-card images">
    <div className="stat-icon">🖼️</div>
    <div>
      <h4>Images</h4>
      <h2>{images.length}</h2>
    </div>
  </div>
  <div className="stat-card favorites">
    <div className="stat-icon">❤️</div>
    <div>
      <h4>Favorites</h4>
      <h2>{favorites.length}</h2>
    </div>
  </div>
  <div className="stat-card projects">
    <div className="stat-icon">📁</div>
    <div>
      <h4>Projects</h4>
    <h2>{projects.length}</h2>
    </div>
  </div>
  <div className="stat-card today">
    <div className="stat-icon">⚡</div>
    <div>
      <h4>Today</h4>
      <h2>{todayImages.length}</h2>
    </div>
  </div>
</div>
      {/* Recent Images */}
    {/* Recent Generations */}
<div className="section">
  <div className="section-header">
    <h2>Recent Generations</h2>
    <button
      className="view-all-btn"
      onClick={() => navigate("/history")}
    >
      View All →
    </button>
  </div>
  {images.length === 0 ? (
    <div className="empty-gallery">
      <div className="empty-icon">🎨</div>
      <h3>No Images Yet</h3>
      <p>
        Start creating amazing AI artwork.
      </p>
    </div>
  ) : (
    <div className="gallery-grid">
      {images.slice(0,6).map((item) => (
        <div key={item.id} className="gallery-card">
          <img
            src={item.image}
            alt={item.prompt}
            className="gallery-image"
          />
          <div className="gallery-overlay">
            <p>{item.prompt}</p>
            <div className="gallery-buttons">
              <button
                onClick={() =>
                  window.open(item.image)
                }
              >
                🔍
              </button>
              <button
                onClick={() => handleDownload(item)}
              >
                ⬇
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      {/* Quick Actions */}
    {/* Quick Actions */}
<div className="section">
  <div className="section-header">
    <h2>⚡ Quick Actions</h2>
  </div>
  <div className="quick-grid">
    <div
      className="quick-card"
      onClick={() => navigate("/studio")}
    >
      <div className="quick-icon">✨</div>
      <div>
        <h3>Generate Image</h3>
        <p>Create stunning AI artwork</p>
      </div>
    </div>
    <div
      className="quick-card"
      onClick={() => navigate("/history")}
    >
      <div className="quick-icon">📜</div>
      <div>
        <h3>History</h3>
        <p>Browse previous generations</p>
      </div>
    </div>
    <div
      className="quick-card"
      onClick={() => navigate("/favorites")}
    >
      <div className="quick-icon">❤️</div>
      <div>
        <h3>Favorites</h3>
        <p>View saved creations</p>
      </div>
    </div>
    <div
      className="quick-card"
      onClick={() => navigate("/projects")}
    >
      <div className="quick-icon">📁</div>
      <div>
        <h3>Projects</h3>
        <p>Organize your AI work</p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
export default Dashboard;