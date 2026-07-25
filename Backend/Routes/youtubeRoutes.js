const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const YoutubeVideo = require("../Models/YoutubeVideo");
const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// Fallback/Demo videos if the database and channel are both empty
const DEMO_VIDEOS = [
  {
    title: "Stack Adda Website Coming Soon",
    videoId: "ElP8rgveK_k",
    link: "https://www.youtube.com/watch?v=ElP8rgveK_k",
    published: new Date("2026-07-07T17:06:11.000Z").toISOString(),
    thumbnailUrl: "https://img.youtube.com/vi/ElP8rgveK_k/maxresdefault.jpg",
    description: "Welcome to Stack Adda! Stay tuned for full-stack courses, project-based tutorials, and placement bootcamps.",
    duration: "2:15",
    isPublished: true
  },
  {
    title: "Mastering React 19 and Tailwind CSS v4",
    videoId: "Ke90Tje7VS0",
    link: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    published: new Date("2026-07-15T10:00:00.000Z").toISOString(),
    thumbnailUrl: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    description: "Learn how to build high-performance web applications with the latest React 19 features and Tailwind CSS v4 styling engine.",
    duration: "45:30",
    isPublished: true
  },
  {
    title: "JavaScript Advanced Concepts & Patterns",
    videoId: "W6NZfCO5SIk",
    link: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    published: new Date("2026-07-20T12:00:00.000Z").toISOString(),
    thumbnailUrl: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    description: "Deep dive into JavaScript closures, prototypes, asynchronous execution patterns, and event loops.",
    duration: "38:15",
    isPublished: true
  }
];

// Helper to sync YouTube videos with the DB
const syncYoutubeVideos = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) return;

  try {
    // 1. Get uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!channelRes.ok) return;
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) return;

    // 2. Get playlist items
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    if (!playlistRes.ok) return;
    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];

    // 3. Save new videos to DB
    for (const item of items) {
      const videoId = item?.snippet?.resourceId?.videoId;
      const title = item?.snippet?.title;
      const description = item?.snippet?.description;
      const thumbnailUrl = item?.snippet?.thumbnails?.maxres?.url || item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url;
      const publishedAt = item?.snippet?.publishedAt;

      if (videoId && title) {
        // Find if exists
        const exists = await YoutubeVideo.findOne({ videoId });
        if (!exists) {
          await YoutubeVideo.create({
            videoId,
            title,
            description,
            thumbnailUrl,
            publishedAt: new Date(publishedAt),
            isPublished: true, // Default to true so it shows automatically
            duration: "15:00"
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to sync YouTube videos:", error);
  }
};

// ==========================
// Get Public YouTube Videos
// ==========================
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Async sync in background
    syncYoutubeVideos().catch(console.error);

    // Get published videos from DB
    let dbVideos = await YoutubeVideo.find({ isPublished: true }).sort({ publishedAt: -1 });

    // Format for frontend
    let videos = dbVideos.map(v => ({
      title: v.title,
      videoId: v.videoId,
      link: `https://www.youtube.com/watch?v=${v.videoId}`,
      published: v.publishedAt,
      thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
      description: v.description,
      duration: v.duration,
      isPublished: v.isPublished
    }));

    // If DB is empty (no videos synced at all), use DEMO_VIDEOS
    const totalCount = await YoutubeVideo.countDocuments();
    if (totalCount === 0 && videos.length === 0) {
      videos = DEMO_VIDEOS;
    }

    res.status(200).json({ success: true, videos });
  })
);

// ==========================
// Get Live YouTube Channel Stats
// ==========================
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // Default mock stats if YouTube API key is missing or fails
    const mockStats = {
      subscribers: "12K+",
      views: "1.2M+",
      videos: "150+",
      channelName: "Stack Adda"
    };

    if (!apiKey || !channelId) {
      return res.status(200).json({ success: true, stats: mockStats });
    }

    try {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
      );
      if (!channelRes.ok) {
        return res.status(200).json({ success: true, stats: mockStats });
      }

      const channelData = await channelRes.json();
      const item = channelData?.items?.[0];
      if (!item) {
        return res.status(200).json({ success: true, stats: mockStats });
      }

      const stats = item.statistics;
      
      // Format large numbers (e.g. 10450 -> 10.4K)
      const formatNumber = (numStr) => {
        const num = parseInt(numStr, 10);
        if (isNaN(num)) return numStr;
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return numStr;
      };

      res.status(200).json({
        success: true,
        stats: {
          subscribers: formatNumber(stats.subscriberCount),
          views: formatNumber(stats.viewCount),
          videos: stats.videoCount,
          channelName: item.snippet?.title || "Stack Adda"
        }
      });
    } catch (error) {
      console.error("YouTube Stats Fetch Error:", error);
      res.status(200).json({ success: true, stats: mockStats });
    }
  })
);

// ==========================
// Admin: Get All Videos (For toggle selection)
// ==========================
router.get(
  "/admin/videos",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    // Run sync first to ensure DB is up to date
    await syncYoutubeVideos().catch(console.error);

    const dbVideos = await YoutubeVideo.find({}).sort({ publishedAt: -1 });
    
    // Fallback if empty
    let videos = dbVideos;
    if (videos.length === 0) {
      videos = DEMO_VIDEOS.map((v, i) => ({
        _id: `demo-${i}`,
        videoId: v.videoId,
        title: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnailUrl,
        publishedAt: v.published,
        isPublished: v.isPublished,
        duration: v.duration
      }));
    }

    res.status(200).json({ success: true, videos });
  })
);

// ==========================
// Admin: Toggle Video Visibility
// ==========================
router.put(
  "/admin/videos/:id/toggle",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    let video = await YoutubeVideo.findById(id);

    // If it's a demo video identifier, let's create a database entry for it to toggle it
    if (!video) {
      // Check if ID matches a videoId
      video = await YoutubeVideo.findOne({ videoId: id });
    }

    if (!video) {
      // Find in demos and create it
      const demo = DEMO_VIDEOS.find(v => v.videoId === id);
      if (demo) {
        video = await YoutubeVideo.create({
          videoId: demo.videoId,
          title: demo.title,
          description: demo.description,
          thumbnailUrl: demo.thumbnailUrl,
          publishedAt: new Date(demo.published),
          isPublished: !demo.isPublished,
          duration: demo.duration
        });
      } else {
        return res.status(404).json({ success: false, message: "Video not found" });
      }
    } else {
      video.isPublished = !video.isPublished;
      await video.save();
    }

    res.status(200).json({ success: true, video });
  })
);

module.exports = router;
