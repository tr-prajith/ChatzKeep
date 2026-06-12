import { io } from "socket.io-client";

let socket;

// ✅ MUST be backend URL in production
const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"], // ✅ IMPORTANT for deployment stability
      reconnection: true,
    });
  }

  return socket;
};

export const getSocket = () => socket;