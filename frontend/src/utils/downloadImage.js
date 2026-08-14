let downloadCount = 1;

export const downloadImage = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is missing");
  }

  try {
    // Fetch the actual image from Supabase Storage
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    // Convert the response into a Blob
    const blob = await response.blob();

    if (!blob.size) {
      throw new Error("Downloaded image is empty");
    }

    // Create a temporary URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create temporary download link
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `chargenai-${downloadCount}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary Blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    downloadCount++;

    return true;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};