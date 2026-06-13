const express = require("express");
const router = express.Router();

const { sendMessage, getMessages, uploadFile} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");
const upload = require('../middleware/multer')

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);
router.post("/upload",protect, upload.single("file"), uploadFile);
module.exports = router;