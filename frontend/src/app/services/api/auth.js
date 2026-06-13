import axios from "axios";

// ✅ MUST be backend deployed URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==========================================
// IMPORTANT FIX: consistent credentials config
// ==========================================

axios.defaults.withCredentials = true;

// ==========================================
// AUTH APIs
// ==========================================

// Register
export const registerUser = async (data) => {
  const res = await axios.post(
    `${BASE_URL}/auth/register`,
    data,
    { withCredentials: true } // 🔥 FIX ADDED
  );
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await axios.post(
    `${BASE_URL}/auth/login`,
    data,
    { withCredentials: true } // 🔥 FIX ADDED
  );
  return res.data;
};

// Profile details
export const completeProfile = async (data) => {
  const res = await axios.put(
    `${BASE_URL}/user/details`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// Get Users
export const getUsers = async () => {
  const res = await axios.get(
    `${BASE_URL}/user/all`,
    { withCredentials: true }
  );
  return res.data;
};

// Get chats
export const getChats = async () => {
  const res = await axios.get(
    `${BASE_URL}/chat`,
    { withCredentials: true }
  );
  return res.data;
};

// Send message
export const sendMessage = async (data) => {
  const res = await axios.post(
    `${BASE_URL}/message`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// Get messages
export const getMessages = async (chatId) => {
  const res = await axios.get(
    `${BASE_URL}/message/${chatId}`,
    { withCredentials: true }
  );
  return res.data;
};

// Create or access chat
export const accessChat = async (userId) => {
  const res = await axios.post(
    `${BASE_URL}/chat`,
    { userId },
    { withCredentials: true }
  );
  return res.data;
};

// Current user
export const getCurrentUser = async () => {
  const res = await axios.get(
    `${BASE_URL}/user/me`,
    { withCredentials: true }
  );
  return res.data;
};

// ==========================================
// Settings
// ==========================================

// Update profile
export const updateProfile = async (data) => {
  const res = await axios.put(
    `${BASE_URL}/user/profile`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// Upload file
export const uploadFile = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}/message/upload`,
    formData,
    {
      withCredentials: true, // 🔥 FIX ADDED
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};