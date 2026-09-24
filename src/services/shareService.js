import axios from "axios";

const API_URL = "http://localhost:5000/api/shares";

export const createShare = async (shareData) => {
  const response = await axios.post(
    API_URL,
    shareData
  );

  return response.data;
};

export const joinShare = async (shareCode) => {
  const response = await axios.post(
    `${API_URL}/join`,
    {
      shareCode,
    }
  );

  return response.data;
};