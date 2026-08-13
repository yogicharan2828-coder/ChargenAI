import { useEffect } from "react";
import "./Imageviewer.css";

function ImageViewer({ image, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="image-viewer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        className="image-viewer-close"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        ✕
      </button>
      <img
        src={image.image_url}
        alt="Full size preview"
        className="image-viewer-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default ImageViewer;