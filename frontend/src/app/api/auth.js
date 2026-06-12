import axios from "axios";

// ✅ MUST be backend deployed URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// important for cookies/session auth
axios.defaults.withCredentials = true;

// ==========================================
// AUTH APIs
// ==========================================

// Register
export const registerUser = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, data);
  return res.data;
};

// Profile details
export const completeProfile = async (data) => {
  const res = await axios.put(`${BASE_URL}/user/details`, data);
  return res.data;
};

// Get Users
export const getUsers = async () => {
  const res = await axios.get(`${BASE_URL}/user/all`);
  return res.data;
};

// Get chats
export const getChats = async () => {
  const res = await axios.get(`${BASE_URL}/chat`);
  return res.data;
};

// Send message
export const sendMessage = async (data) => {
  const res = await axios.post(`${BASE_URL}/message`, data);
  return res.data;
};

// Get messages
export const getMessages = async (chatId) => {
  const res = await axios.get(`${BASE_URL}/message/${chatId}`);
  return res.data;
};

// Create or access chat
export const accessChat = async (userId) => {
  const res = await axios.post(`${BASE_URL}/chat`, { userId });
  return res.data;
};

// Current user
export const getCurrentUser = async () => {
  const res = await axios.get(`${BASE_URL}/user/me`);
  return res.data;
};

// ==========================================
// Settings
// ==========================================

export const updateProfile = async (data) => {
  const res = await axios.put(`${BASE_URL}/user/profile`, data);
  return res.data;
};

// Upload file
export const uploadFile = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}/message/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};