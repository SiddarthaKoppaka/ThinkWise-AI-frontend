// apiHandler.js

import axiosInstance from "./axiosInstance";

const BASE_URL = "http://localhost:8000"; // Change to your backend URL

export async function loginUser(email, password) {
  const response = await fetch(`http://localhost:8000/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Invalid login credentials");
  }

  return await response.json(); // { access_token }
}

export const logout = () => {
  localStorage.removeItem("token");
};




/**
 * Uploads a CSV file to the backend for processing.
 * After upload, waits for the response and returns the top 3 ideas.
 */
export const uploadCSVAndFetchTopIdeas = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Step 1: Upload file
    const uploadResponse = await fetch(`${BASE_URL}/analyze/csv`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error?.detail || "Error uploading and analyzing CSV");
    }

    console.log("📤 File uploaded and analyzed.");

    // Step 2: Call top3 route using filename
    const topIdeasResponse = await fetch(`${BASE_URL}/ideas/top?filename=${encodeURIComponent(file.name)}`);
    const topIdeasData = await topIdeasResponse.json();
    console.log(topIdeasData)
    return topIdeasData.top_3_ideas;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
};



export const getAllIdeas = async () => {
  const response = await fetch(`${BASE_URL}/ideas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  const data = await response.json();
  return data.all_ideas; // ✅ return array directly
};


export const getOverallTopIdeas = async () => {
  const res = await axiosInstance.get("/ideas/overall_top");
  return res.data.top_3_ideas;
};

export const getAllRawData = async () => {
  const res = await axiosInstance.get("/data");
  return res.data;
};

export const getAnalytics = async () => {
  const res = await axiosInstance.get("/analytics");
  return res.data;
};


// api.js
export const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("http://localhost:8000/analyze/csv", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (data.status === "ok" && data.filename) {
      const topRes = await fetch(`http://localhost:8000/ideas/top?filename=${data.filename}`);
      const topData = await topRes.json();
      return topData.top_3_ideas || [];
    } else {
      throw new Error("Upload failed or invalid response");
    }
  };
  