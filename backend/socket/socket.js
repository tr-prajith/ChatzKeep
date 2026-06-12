const { Server } = require("socket.io");
const { createMessage } = require("../controllers/messageController");

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, senderId, text } = data;

        const message = await createMessage({
          chatId,
          senderId,
          text,
        });

        io.to(chatId).emit("receiveMessage", message);

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