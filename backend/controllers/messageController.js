const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

// Send message (HTTP API)
const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ message: "chatId and text required" });
  }

  try {
    const message = await Message.create({
      chatId,
      sender: req.user.id,
      text,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👇 NEW: reusable function for socket
const createMessage = async ({ chatId, senderId, text }) => {
  const message = await Message.create({
    chatId,
    sender: senderId,
    text,
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: text,
  });

  return message;
};

// Get messages
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, createMessage };