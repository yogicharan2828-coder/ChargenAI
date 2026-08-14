import { useState, useRef, useEffect } from "react";
import "./AIStudio.css";
import { generateImage, getImages, deleteAllImages } from "../api/ai";
import RecentPrompts from "../components/RecentPrompts/Recentprompts";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/common/Toast";
import Header from "../components/Header/Header";
import PromptCard from "../components/PromptCard/PromptCard";
import PromptTips from "../components/PromptTips/PromptTips";
import { downloadAllImages } from "../utils/downloadAllImages";
import ImageGallery from "../components/ImageGalllery/ImageGallery";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
function AIStudio() {
  const defaultImages = [image1, image2, image3, image4].map((url, index) => ({
    id: -(index + 1),
    image_url: url,
    favorite: false,
    prompt: "",
    style: "",
    aspect_ratio: "",
  }));
  const [showClearModal, setShowClearModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(defaultImages);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const promptRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const navigate = useNavigate();
const { user } = useAuth();

  const loadImages = async () => {
    try {
      const data = await getImages();

      const mappedPrompts = data.map((img) => ({
        id: img.id,
        prompt: img.prompt,
        image: img.image_url,
        style: img.style,
        ratio: img.aspect_ratio,
      }));
      setRecentPrompts(mappedPrompts);

      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadImages();
  }, []);
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      showNotification("Enter a prompt before enhancing.", "error");
      return;
    }
    if (prompt.includes("ultra realistic")) {
      showNotification("Prompt is already enhanced.", "error");
      return;
    }
    const enhancedPrompt = `${prompt},
ultra realistic,
8K,
cinematic lighting,
highly detailed,
professional photography,
award-winning composition`;
    setPrompt(enhancedPrompt);
    showNotification("Prompt enhanced successfully!", "success");
  };
  const handleClearAll = async () => {
    try {
      await deleteAllImages();
      await loadImages();
      setShowClearModal(false);
      showNotification(
        "All images cleared successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);
      showNotification(
        "Failed to clear images.",
        "error"
      );
    }
  };
const handleOpenClearModal = () => {
  setShowClearModal(true);
};
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification("Please enter a prompt.", "error");
      return;
    }

   if (!user) {
    showNotification(
      "Please login to generate images.",
      "error"
    );
    return;
  }

    try {
      setLoading(true);
      const currentPrompt = prompt;
      await generateImage(currentPrompt);
      await loadImages();
      showNotification("Image generated successfully!", "success");
      // Clear prompt
      setPrompt("");
      // Focus textarea again
      setTimeout(() => {
        promptRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error(error);
      showNotification("Failed to generate image.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadAll = async () => {
  if (images.length === 0) {
    showNotification("No images available", "error");
    return;
  }

  try {
    const urls = images.map((img) => img.image_url);

    const result = await downloadAllImages(urls);

    if (result.failed > 0) {
      showNotification(
        `${result.downloaded} image(s) downloaded. ${result.failed} failed.`,
        "error"
      );
    } else {
      showNotification(
        `All ${result.downloaded} image(s) downloaded successfully!`,
        "success"
      );
    }
  } catch (error) {
    console.error("Download all failed:", error);

    showNotification(
      "Failed to download images.",
      "error"
    );
  }
};

const handleReusePrompt = (text) => {
  setPrompt(text);

  setTimeout(() => {
    promptRef.current?.focus();
  }, 100);
};

const handleDeletePrompt = (id) => {
  const updated = recentPrompts.filter(
    (item) => item.id !== id
  );

  setRecentPrompts(updated);

  showNotification(
    "Prompt deleted successfully!",
    "success"
  );
};

return (
  <div className="studio">
    <Toast
      show={showToast}
      message={toastMessage}
      type={toastType}
      actionLabel={
        !user && toastType === "error"
          ? "Login"
          : null
      }
      onAction={
        !user && toastType === "error"
          ? () => navigate("/login")
          : null
      }
    />

    {/* Header */}
    <Header
      title="AI Image Generator"
      subtitle="Create stunning images with the power of AI"
    />

    {/* Prompt Section */}
    <div className="studio-grid">
      <PromptCard
        promptRef={promptRef}
        prompt={prompt}
        onPromptChange={(e) => setPrompt(e.target.value)}
        onEnhance={handleEnhancePrompt}
        onGenerate={handleGenerate}
        loading={loading}
      />

      <PromptTips />
    </div>

    {/* Generated Images */}
    <ImageGallery
      images={images}
      loading={loading}
      showNotification={showNotification}
      handleDownloadAll={handleDownloadAll}
      handleOpenClearModal={handleOpenClearModal}
    />

    {/* Recent Prompts */}
    <RecentPrompts
      prompts={recentPrompts}
      onReuse={handleReusePrompt}
      onDelete={handleDeletePrompt}
    />

    <ConfirmModal
      isOpen={showClearModal}
      title="Clear All Images"
      message="Are you sure you want to delete all generated images? This action cannot be undone."
      onConfirm={handleClearAll}
      onCancel={() => setShowClearModal(false)}
    />
  </div>
);
}

export default AIStudio;