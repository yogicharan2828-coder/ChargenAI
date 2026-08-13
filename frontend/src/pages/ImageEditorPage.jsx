import { useState } from "react";
import Toast from "../components/common/Toast";
import ImageEditor from "../components/ImageEditor/imageEditor";

function ImageEditorPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="image-editor-page">
      <Toast show={showToast} message={toastMessage} type={toastType} />
      <ImageEditor showNotification={showNotification} />
    </div>
  );
}

export default ImageEditorPage;