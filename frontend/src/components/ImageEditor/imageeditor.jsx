import { useState, useRef, useEffect } from "react";
import "./imageeditor.css";
import { editImage } from "../../api/ai";
import { downloadAllImages } from "../../utils/downloadAllImages";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const EXAMPLE_PROMPTS = [
  "Change the background to a sunset",
  "Make the sky dramatic",
  "Change the shirt color to black",
  "Add cinematic lighting",
];

function ImageEditor({ onSuccess, showNotification }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up the object URL whenever it changes or the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const applySelectedFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showNotification("Please select a PNG, JPG, or WEBP image.", "error");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setEditedResult(null);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    applySelectedFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    applySelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditImage = async () => {
    if (!selectedFile) {
      showNotification("Please select an image.", "error");
      return;
    }
    if (!editPrompt.trim()) {
      showNotification("Please enter an editing prompt.", "error");
      return;
    }
    if (isEditing) return;

    try {
      setIsEditing(true);
      const result = await editImage(selectedFile, editPrompt);
      setEditedResult(result);
      showNotification("Image edited successfully!", "success");
      if (typeof onSuccess === "function") {
        await onSuccess();
      }
    } catch (error) {
      console.error(error);
      const message = error?.message || "Failed to edit image.";
      showNotification(message, "error");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownloadEdited = () => {
    if (!editedResult?.image_url) return;
    downloadAllImages([editedResult.image_url]);
    showNotification("Downloading edited image...", "success");
  };

  const handleEditAnother = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditPrompt("");
    setEditedResult(null);
  };

  const handleExampleClick = (example) => {
    if (isEditing) return;
    setEditPrompt(example);
  };

  return (
    <div className="image-editor">
      <div className="image-editor-header">
        <h2 className="image-editor-title">
          <span className="image-editor-sparkle" aria-hidden="true">
            ✨
          </span>
          AI Image Editor
        </h2>
        <p className="image-editor-subtitle">
          Edit an existing image using natural language
        </p>
      </div>

      <div className="image-editor-panel">
        {!editedResult && !previewUrl && (
          <div
            className={`image-editor-dropzone${
              isDragActive ? " is-active" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleBrowseClick();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileInputChange}
              className="image-editor-file-input"
            />
            <div className="image-editor-dropzone-icon">📤</div>
            <p className="image-editor-dropzone-title">Upload Image</p>
            <p className="image-editor-dropzone-hint">
              Drag &amp; drop an image here, or click to browse
            </p>
          </div>
        )}

        {!editedResult && previewUrl && (
          <div className="image-editor-edit-form">
            <div className="image-editor-preview-wrap">
              <img
                src={previewUrl}
                alt="Selected for editing"
                className="image-editor-preview-img"
              />
              <button
                type="button"
                className="image-editor-change-btn"
                onClick={handleBrowseClick}
                disabled={isEditing}
              >
                Change Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileInputChange}
                className="image-editor-file-input"
              />
            </div>

            <label className="image-editor-label" htmlFor="ie-edit-prompt">
              Describe what you want to change
            </label>
            <textarea
              id="ie-edit-prompt"
              className="image-editor-textarea"
              placeholder="Describe what you want to change..."
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              rows={3}
              disabled={isEditing}
            />

            <div className="image-editor-examples">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="image-editor-example-chip"
                  onClick={() => handleExampleClick(example)}
                  disabled={isEditing}
                >
                  {example}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="image-editor-submit-btn"
              onClick={handleEditImage}
              disabled={isEditing}
            >
              {isEditing ? "✨ Editing Image..." : "✨ Edit Image"}
            </button>
          </div>
        )}

        {editedResult && (
          <div className="image-editor-result">
            <div className="image-editor-result-grid">
              <div className="image-editor-result-col">
                <span className="image-editor-result-label">Original</span>
                <img
                  src={previewUrl}
                  alt="Original"
                  className="image-editor-result-img"
                />
              </div>
              <div className="image-editor-result-col">
                <span className="image-editor-result-label">
                  Edited Result
                </span>
                <img
                  src={editedResult.image_url}
                  alt="Edited result"
                  className="image-editor-result-img"
                />
              </div>
            </div>

            <div className="image-editor-result-actions">
              <button
                type="button"
                className="image-editor-download-btn"
                onClick={handleDownloadEdited}
              >
                Download Edited Image
              </button>
              <button
                type="button"
                className="image-editor-again-btn"
                onClick={handleEditAnother}
              >
                Edit Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageEditor;