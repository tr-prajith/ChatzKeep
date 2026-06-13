import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = () => socket;