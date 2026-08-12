let downloadCount = 1;

export const downloadAllImages = (images) => {
  images.forEach((imageUrl) => {
    try {
      const url = new URL(imageUrl);
      const filename = url.pathname.split("/").pop();

      if (!filename) {
        console.error("Invalid image URL:", imageUrl);
        return;
      }

      const downloadUrl = `${url.origin}/download/${encodeURIComponent(filename)}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `chargenai-${downloadCount}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      downloadCount++;
    } catch (error) {
      console.error("Download failed:", error);
    }
  });
};