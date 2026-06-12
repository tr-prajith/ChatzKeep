const Chat = require("../models/chatModel");

// Create or access chat
const accessChat = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.user);
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId required" });
        }

        // check existing chat
        let chat = await Chat.findOne({
            participants: { $all: [req.user.id, userId] },
        });

        if (chat) return res.json(chat);

        // create new chat
        chat = await Chat.create({
            participants: [req.user.id, userId],
        });

        res.json(chat);


    } catch (err) {
        console.log("CHAT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get all chats
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user.id,
        })
            .populate("participants", "email phone firstName lastName")
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { accessChat, getChats };