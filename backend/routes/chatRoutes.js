const express = require("express");
const router = express.Router();

const { accessChat,getChats} = require("../controllers/chatController");

const  protect  = require("../middleware/authMiddleware");

// router.post("/", (req, res, next) => {
//     console.log("POST /chat HIT");
//     next();
// }, protect, accessChat);
// create or get one-to-one chat
router.post("/", protect, accessChat);

// get all chats of logged-in user
router.get("/", protect, getChats);

module.exports = router;