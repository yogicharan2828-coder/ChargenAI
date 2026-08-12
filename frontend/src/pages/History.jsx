import { useEffect, useState } from "react";
import "./History.css";
import { useAuth } from "../auth/AuthContext";
import { downloadImage } from "../utils/downloadImage";
import { getImages, deleteImage } from "../api/ai";

function History() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await getImages();
      const mapped = data.map((img) => ({
        id: img.id,
        prompt: img.prompt,
        image: img.image_url,
        style: img.style,
        ratio: img.aspect_ratio,
        createdAt: img.created_at,
      }));
      setHistory(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // AuthContext is the single source of truth for auth state now.
    // Don't touch getImages() until it has finished resolving the
    // session — this is what removes the empty-state flash.
    if (authLoading) {
      return;
    }

    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    loadHistory();
  }, [authLoading, user]);

  const deleteHistory = async (id) => {
    try {
      await deleteImage(id);
      // Silent refresh, same as before — no loading flash on delete.
      await loadHistory({ showLoading: false });
    } catch (error) {
      console.error(error);
    }
  };

  // Auth session is still being resolved by AuthContext.
  if (authLoading) {
    return (
      <div className="history-page">
        <h1>History</h1>
        <div className="empty-history">
          <h2>Loading...</h2>
          <p>Checking your session.</p>
        </div>
      </div>
    );
  }

  // Auth has resolved and there is no logged-in user.
  if (!user) {
    return (
      <div className="history-page">
        <h1>History</h1>
        <div className="empty-history">
          <h2>Please Log In</h2>
          <p>Log in to see your generated images.</p>
        </div>
      </div>
    );
  }

  // User is authenticated, images are still being fetched.
  if (loading) {
    return (
      <div className="history-page">
        <h1>History</h1>
        <div className="empty-history">
          <h2>Loading your creations...</h2>
        </div>
      </div>
    );
  }

  // User is authenticated, fetch has completed, and there really are
  // zero images.
  if (history.length === 0) {
    return (
      <div className="history-page">
        <h1>History</h1>
        <div className="empty-history">
          <h2>No History Yet</h2>
          <p>Generate some AI images to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1>History</h1>
      <div className="history-grid">
        {history.map((item) => (
          <div key={item.id} className="history-card">
            <img
              src={item.image}
              alt={item.prompt}
              className="history-image"
            />
            <div className="history-content">
              <p className="prompt">{item.prompt}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
              <div className="history-actions">
                <button onClick={() => downloadImage(item.image)}>
                  ⬇ Download
                </button>

                <button onClick={() => deleteHistory(item.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default History;