const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");


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
      updatedAt: new Date(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createMessage = async ({ chatId, senderId, text }) => {
  if (!chatId || !senderId || !text) {
    throw new Error("chatId, senderId and text are required");
  }

  const message = await Message.create({
    chatId,
    sender: senderId,
    text,
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: text,
    updatedAt: new Date(),
  });

  return message;
};


const getMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ message: "chatId is required" });
  }

  try {
    const messages = await Message.find({ chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      file: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  createMessage,
  uploadFile,
};