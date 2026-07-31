const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Short = require("../Models/Short");
const ShortComment = require("../Models/ShortComment");
const ShortHistory = require("../Models/ShortHistory");
const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// ==========================
// Sync Helpers
// ==========================

const getDurationInSeconds = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const syncYoutubeShorts = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";
  const defaultChannelId = process.env.YOUTUBE_CHANNEL_ID || "UC5lX2UJ-nbyGYT6WYlhQskQ";
  const channelIds = [defaultChannelId, "UCJJ6BYkQb7ScqhcfszAYKzA", "UC-6BdOOBFl6XSp_ZOoQIgJg"];

  let newShortsCount = 0;

  for (const channelId of channelIds) {
    try {
      const channelRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
      );
      const channelData = channelRes.data;
      const uploadsPlaylistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      
      if (!uploadsPlaylistId) continue;

      const playlistRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
      );
      const items = playlistRes.data?.items || [];

      const videoIds = items.map(item => item?.snippet?.resourceId?.videoId).filter(Boolean);
      if (videoIds.length === 0) continue;

      const videosDetailsRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${apiKey}`
      );
      const detailsItems = videosDetailsRes.data?.items || [];

      for (const item of items) {
        const videoId = item?.snippet?.resourceId?.videoId;
        const title = item?.snippet?.title;
        const description = item?.snippet?.description;
        const thumbnailUrl = item?.snippet?.thumbnails?.maxres?.url || item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url;

        const detail = detailsItems.find(d => d.id === videoId);
        if (!detail) continue;

        const durationInSeconds = getDurationInSeconds(detail.contentDetails?.duration);
        
        // Duration <= 61 seconds is considered a short
        if (durationInSeconds > 0 && durationInSeconds <= 61) {
          const exists = await Short.findOne({ videoId });
          if (exists) {
             exists.views = parseInt(detail.statistics?.viewCount || exists.views, 10);
             await exists.save();
          } else {
             await Short.create({
               videoId,
               title: title || "New Short",
               description: description || "",
               thumbnail: thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
               category: "Education",
               tags: [],
               isPublished: true, 
               views: parseInt(detail.statistics?.viewCount || 0, 10),
             });
             newShortsCount++;
          }
        }
      }
    } catch (err) {
      console.error(`Failed to sync shorts for channel ${channelId}:`, err.message);
    }
  }

  return newShortsCount;
};

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

// Get Saved Shorts
router.get(
  "/user/saved",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const shorts = await Short.find({ savedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("creator", "name profileImage");
    res.status(200).json({ success: true, shorts });
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
    // Optionally trigger background sync here or just let the button do it. 
    // We'll rely on the manual Sync button.
    const shorts = await Short.find().sort({ createdAt: -1 }).populate("creator", "name");
    res.status(200).json({ success: true, shorts });
  })
);

// Sync Shorts from Channels (Admin)
router.post(
  "/admin/sync",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    try {
      const addedCount = await syncYoutubeShorts();
      res.status(200).json({ success: true, message: `Successfully synced. Added ${addedCount} new shorts.` });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sync shorts" });
    }
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
