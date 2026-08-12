import { supabase } from "../lib/supabase";

const API_URL = "http://localhost:8000";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Please login to continue.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function generateImage(prompt) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({
      prompt,
      model: "flux",
      aspect_ratio: "16:9",
      style: "realistic",
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate image");
  }
  return await response.json();
}
export async function editImage(imageFile, prompt) {
  const authHeaders = await getAuthHeaders();

  const formData = new FormData();

  formData.append("image", imageFile);
  formData.append("prompt", prompt);

  const response = await fetch(`${API_URL}/edit-image`, {
    method: "POST",
    headers: {
      ...authHeaders,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to edit image.";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "object") {
        message =
          errorData.detail.message ||
          errorData.detail.error_type ||
          message;
      } else if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep generic error message
    }

    throw new Error(message);
  }

  return await response.json();
}
export async function getImages() {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/images`, {
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return await response.json();
}
export async function toggleFavorite(id) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/images/${id}/favorite`, {
    method: "PATCH",
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to toggle favorite");
  }
  return await response.json();
}
export async function getFavorites() {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/favorites`, {
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return await response.json();
}
export async function deleteImage(id) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/images/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete image");
  }
  return await response.json();
}
export async function deleteAllImages() {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/images`, {
    method: "DELETE",
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete all images");
  }
  return await response.json();
}

export async function getProjects() {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      ...authHeaders,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return await response.json();
}

export async function createProject(data) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return await response.json();
}

export async function updateProject(id, data) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return await response.json();
}

export async function deleteProject(id) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return await response.json();
}

export async function addImageToProject(projectId, imageId) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/projects/${projectId}/images/${imageId}`,
    {
      method: "POST",
      headers: {
        ...authHeaders,
      },
    }
  );

  if (!response.ok) {
    // Try to surface the backend's own error message (e.g. the 400
    // "Image already exists in this project" case). Fall back to a
    // generic message if the body isn't JSON or has no message field.
    let message = "Failed to save image.";
    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.message || message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  // Some backends return an empty body on success — guard against
  // a JSON parse error so a successful save isn't reported as a failure.
  try {
    return await response.json();
  } catch {
    return null;
  }
}
export async function getProjectImages(projectId) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/projects/${projectId}/images`,
    {
      headers: {
        ...authHeaders,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project images");
  }

  return await response.json();
}

export async function removeImageFromProject(projectId, imageId) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/projects/${projectId}/images/${imageId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeaders,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove image from project");
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
export async function getProfile() {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      ...authHeaders,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return await response.json();
}