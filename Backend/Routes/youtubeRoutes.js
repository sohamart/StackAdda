const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const YoutubeVideo = require("../Models/YoutubeVideo");
const User = require("../Models/User");
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
    isPublished: true,
    views: 125,
    likes: 24
  },
  {
    title: "Mastering React 19 and Tailwind CSS v4",
    videoId: "Ke90Tje7VS0",
    link: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    published: new Date("2026-07-15T10:00:00.000Z").toISOString(),
    thumbnailUrl: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    description: "Learn how to build high-performance web applications with the latest React 19 features and Tailwind CSS v4 styling engine.",
    duration: "45:30",
    isPublished: true,
    views: 890,
    likes: 112
  },
  {
    title: "JavaScript Advanced Concepts & Patterns",
    videoId: "W6NZfCO5SIk",
    link: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    published: new Date("2026-07-20T12:00:00.000Z").toISOString(),
    thumbnailUrl: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    description: "Deep dive into JavaScript closures, prototypes, asynchronous execution patterns, and event loops.",
    duration: "38:15",
    isPublished: true,
    views: 560,
    likes: 80
  }
];

// Helper to parse ISO 8601 duration (e.g. PT15M30S -> 15:30)
const parseISO8601Duration = (duration) => {
  if (!duration) return "15:00";
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "15:00";
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper to sync YouTube videos with the DB
const syncYoutubeVideos = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "UC5lX2UJ-nbyGYT6WYlhQskQ";
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

    // 2. Get playlist items (snippet contains video items)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    if (!playlistRes.ok) return;
    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];

    // Collect all video IDs to query details/statistics in batch
    const videoIds = items
      .map(item => item?.snippet?.resourceId?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return;

    // 3. Query YouTube videos statistics (views, likes, duration)
    const videosDetailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${apiKey}`
    );
    if (!videosDetailsRes.ok) return;
    const detailsData = await videosDetailsRes.json();
    const detailsItems = detailsData?.items || [];

    // Create a dictionary of statistics by videoId
    const detailsMap = {};
    for (const dItem of detailsItems) {
      detailsMap[dItem.id] = {
        views: parseInt(dItem?.statistics?.viewCount || 0, 10),
        likes: parseInt(dItem?.statistics?.likeCount || 0, 10),
        duration: parseISO8601Duration(dItem?.contentDetails?.duration)
      };
    }

    // 4. Save/Update videos in DB
    for (const item of items) {
      const videoId = item?.snippet?.resourceId?.videoId;
      const title = item?.snippet?.title;
      const description = item?.snippet?.description;
      const thumbnailUrl = item?.snippet?.thumbnails?.maxres?.url || item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url;
      const publishedAt = item?.snippet?.publishedAt;

      if (videoId && title) {
        const stats = detailsMap[videoId] || { views: 0, likes: 0, duration: "15:00" };

        const exists = await YoutubeVideo.findOne({ videoId });
        if (exists) {
          // Update live metrics & details, keep custom published state
          exists.title = title;
          exists.description = description;
          exists.thumbnailUrl = thumbnailUrl;
          exists.views = stats.views;
          exists.likes = stats.likes;
          exists.duration = stats.duration;
          await exists.save();
        } else {
          // Create new record
          await YoutubeVideo.create({
            videoId,
            title,
            description,
            thumbnailUrl,
            publishedAt: new Date(publishedAt),
            isPublished: true, // Default to true so it shows automatically
            duration: stats.duration,
            views: stats.views,
            likes: stats.likes
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
      _id: v._id,
      title: v.title,
      videoId: v.videoId,
      link: `https://www.youtube.com/watch?v=${v.videoId}`,
      published: v.publishedAt,
      thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
      description: v.description,
      duration: v.duration,
      isPublished: v.isPublished,
      views: v.views || 0,
      likes: v.likes || 0
    }));

    // If DB has 0 videos in total (never synced or channel is empty), use DEMO_VIDEOS
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
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";
    const channelId = process.env.YOUTUBE_CHANNEL_ID || "UC5lX2UJ-nbyGYT6WYlhQskQ";

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
    
    // Format response
    let videos = dbVideos.map(v => ({
      _id: v._id,
      videoId: v.videoId,
      title: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
      publishedAt: v.publishedAt,
      isPublished: v.isPublished,
      duration: v.duration,
      views: v.views || 0,
      likes: v.likes || 0
    }));

    if (videos.length === 0) {
      videos = DEMO_VIDEOS.map((v, i) => ({
        _id: `demo-${i}`,
        videoId: v.videoId,
        title: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnailUrl,
        publishedAt: v.published,
        isPublished: v.isPublished,
        duration: v.duration,
        views: v.views,
        likes: v.likes
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
          duration: demo.duration,
          views: demo.views,
          likes: demo.likes
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

// ==========================
// Get Teammates for Home Page
// ==========================
router.get(
  "/teammates",
  asyncHandler(async (req, res) => {
    const teammates = await User.find({ showOnHome: true, role: "admin" }).select("name bio profileImage instagram telegram email");
    res.status(200).json({ success: true, teammates });
  })
);

// ==========================
// Get Instructors for Student Panel
// ==========================
router.get(
  "/instructors",
  asyncHandler(async (req, res) => {
    const instructors = await User.find({ isInstructor: true, role: "admin" }).select("name bio profileImage instagram telegram email");
    res.status(200).json({ success: true, instructors });
  })
);

module.exports = router;
