const FAVORITES_KEY = "chargeni_favorites";

// Get all favorites
export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Check if image is already favorite
export const isFavorite = (image) => {
  const favorites = getFavorites();
  return favorites.some((item) => item.image === image);
};

// Add to favorites
export const addFavorite = (item) => {
  const favorites = getFavorites();

  favorites.unshift(item);

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  );
};

// Remove from favorites
export const removeFavorite = (image) => {
  const favorites = getFavorites().filter(
    (item) => item.image !== image
  );

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  );
};

// Toggle favorite
export const toggleFavorite = (item) => {

  if (isFavorite(item.image)) {

    removeFavorite(item.image);
    return false;

  }

  addFavorite(item);
  return true;

};