const { Server } = require("socket.io");
const { createMessage } = require("../controllers/messageController");

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, // ✅ FIXED
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", (chatId) => {
      if (chatId) socket.join(chatId);
    });

    // Join user room (notifications)
    socket.on("setupUser", (userId) => {
      if (userId) socket.join(userId);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      try {
        const {
          chatId,
          senderId,
          receiverId,
          text,
          senderName,
          senderAvatar,
        } = data;

        const message = await createMessage({
          chatId,
          senderId,
          text,
        });

        // emit message to chat room
        io.to(chatId).emit("receiveMessage", message);

        // notification
        if (receiverId) {
          io.to(receiverId).emit("notification", {
            _id: message._id,
            senderName: senderName || "User",
            senderAvatar: senderAvatar || "",
            text,
            chatId,
            createdAt: new Date(),
          });
        }

      } catch (err) {
        console.log("Socket error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = socketSetup;