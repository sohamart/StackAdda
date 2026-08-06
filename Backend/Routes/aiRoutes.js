const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../Controllers/aiController");

// @route   POST /api/ai/chat
// @desc    Chat with Stack Adda AI Assistant
// @access  Public
router.post("/chat", chatWithAI);

module.exports = router;
