import "./Favorites.css";
import { useEffect, useState } from "react";
import { getFavorites } from "../../api/ai";
function Favorites() {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadFavorites();
  }, []);
  return (
    <div className="favorites-page">
      <h2>❤️ Favorite Images</h2>

      {favorites.length === 0 ? (
        <p>No favorite images yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="favorite-card"
            >
              <img
                src={item.image_url}
                alt={item.prompt}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Favorites;