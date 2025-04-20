// uploadService.js
import axiosInstance from "./axiosInstance";

export const analyzeIdeas = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/analyze/csv", formData);
    return response.data;
  } catch (error) {
    console.error("Error analyzing ideas:", error);
    throw error.response?.data?.detail || "Upload failed";
  }
};
