const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Short = require("../Models/Short");
const ShortComment = require("../Models/ShortComment");
const ShortHistory = require("../Models/ShortHistory");
const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// ==========================
// Public Routes
// ==========================

// Get all published shorts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shorts = await Short.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creator", "name profileImage");

    res.status(200).json({ success: true, shorts });
  })
);

// Get Trending Shorts
router.get(
  "/trending",
  asyncHandler(async (req, res) => {
    const shorts = await Short.find({ isPublished: true })
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .populate("creator", "name profileImage");
    res.status(200).json({ success: true, shorts });
  })
);

// Get Recommended Shorts
router.get(
  "/recommended",
  asyncHandler(async (req, res) => {
    const shorts = await Short.find({ isPublished: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("creator", "name profileImage");
    res.status(200).json({ success: true, shorts });
  })
);

// Get Short by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id).populate("creator", "name profileImage");
    if (!short) {
      return res.status(404).json({ success: false, message: "Short not found" });
    }
    res.status(200).json({ success: true, short });
  })
);


// ==========================
// User Routes
// ==========================

// Get user history
router.get(
  "/user/history",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const history = await ShortHistory.find({ userId: req.user.id })
      .sort({ watchedAt: -1 })
      .populate("shortId");
    res.status(200).json({ success: true, history });
  })
);

// Toggle Like
router.post(
  "/:id/like",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    const isLiked = short.likes.includes(req.user.id);
    if (isLiked) {
      short.likes = short.likes.filter((id) => id.toString() !== req.user.id.toString());
    } else {
      short.likes.push(req.user.id);
    }
    await short.save();

    res.status(200).json({ success: true, isLiked: !isLiked, likesCount: short.likes.length });
  })
);

// Toggle Save
router.post(
  "/:id/save",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    const isSaved = short.savedBy.includes(req.user.id);
    if (isSaved) {
      short.savedBy = short.savedBy.filter((id) => id.toString() !== req.user.id.toString());
    } else {
      short.savedBy.push(req.user.id);
    }
    await short.save();

    res.status(200).json({ success: true, isSaved: !isSaved });
  })
);

// Record View
router.post(
  "/:id/view",
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    short.views += 1;
    await short.save();

    // If user is logged in, record history (optional implementation here)
    if (req.user) {
        // Find existing history to update or create new
        // Assuming authMiddleware is optionally used for this route to inject req.user if present
    }

    res.status(200).json({ success: true, views: short.views });
  })
);

// Share Short
router.post(
  "/:id/share",
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    short.shares += 1;
    await short.save();

    res.status(200).json({ success: true, shares: short.shares });
  })
);

// Add Comment
router.post(
  "/:id/comment",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

    const comment = await ShortComment.create({
      shortId: req.params.id,
      userId: req.user.id,
      text,
    });

    const populatedComment = await ShortComment.findById(comment._id).populate("userId", "name profileImage");

    res.status(201).json({ success: true, comment: populatedComment });
  })
);

// Get Comments for a Short
router.get(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    const comments = await ShortComment.find({ shortId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("userId", "name profileImage");
    res.status(200).json({ success: true, comments });
  })
);

// Delete Comment
router.delete(
  "/comment/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const comment = await ShortComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Allow user who created the comment OR admin to delete
    if (comment.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted" });
  })
);


// ==========================
// Admin Routes
// ==========================

// Get All Shorts (Admin)
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const shorts = await Short.find().sort({ createdAt: -1 }).populate("creator", "name");
    res.status(200).json({ success: true, shorts });
  })
);

// Add Short
router.post(
  "/admin/add",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const { videoUrl, title, description, category, tags } = req.body;

    // Extract video ID from URL
    let videoId = videoUrl;
    if (videoUrl.includes("youtube.com/shorts/")) {
      videoId = videoUrl.split("youtube.com/shorts/")[1].split("?")[0];
    } else if (videoUrl.includes("v=")) {
      videoId = videoUrl.split("v=")[1].split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
    }

    if (!videoId) {
      return res.status(400).json({ success: false, message: "Invalid YouTube URL" });
    }

    const exists = await Short.findOne({ videoId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Short already exists" });
    }

    const short = await Short.create({
      videoId,
      title: title || "New Short",
      description: description || "",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      category: category || "Education",
      tags: tags || [],
      creator: req.user.id,
    });

    res.status(201).json({ success: true, short });
  })
);

// Edit Short
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const short = await Short.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });
    res.status(200).json({ success: true, short });
  })
);

// Delete Short
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });
    
    // Also delete associated comments
    await ShortComment.deleteMany({ shortId: req.params.id });
    
    await short.deleteOne();
    res.status(200).json({ success: true, message: "Short deleted" });
  })
);

// Toggle Publish
router.put(
  "/admin/publish/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    short.isPublished = !short.isPublished;
    await short.save();

    res.status(200).json({ success: true, short });
  })
);

// Toggle Feature
router.put(
  "/admin/feature/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ success: false, message: "Short not found" });

    short.featured = !short.featured;
    await short.save();

    res.status(200).json({ success: true, short });
  })
);

module.exports = router;
