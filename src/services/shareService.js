import axios from "axios";

const API_URL =
  "http://localhost:5000/api/shares";

// ==========================================
// Create Share
// ==========================================

export const createShare = async (
  shareData
) => {
  const response = await axios.post(
    API_URL,
    shareData
  );

  return response.data;
};

// ==========================================
// Join Share
// ==========================================

export const joinShare = async (
  shareCode
) => {
  const response = await axios.post(
    `${API_URL}/join`,
    {
      shareCode,
    }
  );

  return response.data;
};

// ==========================================
// Verify Password
// ==========================================

export const verifySharePassword = async (
  shareCode,
  password
) => {
  const response = await axios.post(
    `${API_URL}/verify-password`,
    {
      shareCode,
      password,
    }
  );

  return response.data;
};

// ==========================================
// Upload File
// ==========================================

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:5000/api/files/upload",
    formData
  );

  return response.data;
};