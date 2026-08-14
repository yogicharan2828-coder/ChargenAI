import { downloadImage } from "./downloadImage";

export const downloadAllImages = async (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("No images available for download");
  }

  const results = [];

  // Download one image at a time.
  // This is more reliable than triggering many downloads simultaneously,
  // especially on mobile browsers.
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];

    try {
      await downloadImage(imageUrl);

      results.push({
        imageUrl,
        success: true,
      });

      // Small delay between downloads.
      // Helps prevent browsers from blocking multiple downloads.
      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Failed to download image ${i + 1}:`, error);

      results.push({
        imageUrl,
        success: false,
        error,
      });
    }
  }

  const successful = results.filter((item) => item.success);
  const failed = results.filter((item) => !item.success);

  // If every image failed, treat the entire operation as failed.
  if (successful.length === 0) {
    throw new Error("Failed to download images");
  }

  return {
    total: images.length,
    downloaded: successful.length,
    failed: failed.length,
    results,
  };
};