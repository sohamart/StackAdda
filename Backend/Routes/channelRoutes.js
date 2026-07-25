const express = require("express");
const router = express.Router();

const {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
} = require("../Controllers/channelController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// Public route to get all channels
router.get("/", getChannels);

// Admin only routes for managing channels
router.post("/", authMiddleware, roleMiddleware("admin"), createChannel);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateChannel);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteChannel);

module.exports = router;
