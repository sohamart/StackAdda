const express = require("express");
const router = express.Router();
const { chatWithAI, getChatHistory } = require("../Controllers/aiController");
const optionalAuthMiddleware = require("../Middleware/optionalAuthMiddleware");
const authMiddleware = require("../Middleware/authMiddleware");

// @route   POST /api/ai/chat
// @desc    Chat with Stack Adda AI Assistant
// @access  Public (Optional Auth)
router.post("/chat", optionalAuthMiddleware, chatWithAI);

// @route   GET /api/ai/chat/history
// @desc    Get user's chat history
// @access  Public (Optional Auth)
router.get("/chat/history", optionalAuthMiddleware, getChatHistory);

module.exports = router;
