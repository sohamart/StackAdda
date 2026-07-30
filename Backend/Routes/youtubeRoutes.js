const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
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
    const channelRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const channelData = channelRes.data;
    const uploadsPlaylistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) return;

    // 2. Get playlist items (snippet contains video items)
    const playlistRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    const playlistData = playlistRes.data;
    const items = playlistData?.items || [];

    // Collect all video IDs to query details/statistics in batch
    const videoIds = items
      .map(item => item?.snippet?.resourceId?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return;

    // 3. Query YouTube videos statistics (views, likes, duration)
    const videosDetailsRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${apiKey}`
    );
    const detailsData = videosDetailsRes.data;
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

    // 5. Cleanup deleted videos from DB
    const allDbVideos = await YoutubeVideo.find({});
    if (allDbVideos.length > 0) {
      const allVideoIds = allDbVideos.map(v => v.videoId);
      
      for (let i = 0; i < allVideoIds.length; i += 50) {
        const batch = allVideoIds.slice(i, i + 50);
        try {
          const checkRes = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=id&id=${batch.join(",")}&key=${apiKey}`
          );
          
          if (checkRes.data && checkRes.data.items) {
             const validIds = new Set(checkRes.data.items.map(item => item.id));
             
             for (const videoId of batch) {
                if (!validIds.has(videoId)) {
                   await YoutubeVideo.deleteOne({ videoId });
                }
             }
          }
        } catch (err) {
          console.error("Error checking video validity for batch:", err.message);
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
      const channelRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
      );
      
      const channelData = channelRes.data;
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

// ==========================
// Fetch YouTube Playlist for Admin Course Builder
// ==========================
router.get(
  "/fetch-playlist/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";

    // Get Playlist Details
    const playlistRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    );
    const playlistDetails = playlistRes.data.items?.[0]?.snippet;
    if (!playlistDetails) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    let videos = [];
    let nextPageToken = "";

    do {
      const itemsRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
      );
      const items = itemsRes.data.items || [];
      
      const videoIds = items.map(item => item.contentDetails?.videoId).filter(Boolean);
      
      if (videoIds.length > 0) {
        const detailsRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`
        );
        const detailsMap = {};
        (detailsRes.data.items || []).forEach(v => {
          detailsMap[v.id] = parseDuration(v.contentDetails?.duration);
        });

        items.forEach(item => {
          const vId = item.contentDetails?.videoId;
          if (vId) {
            videos.push({
              title: item.snippet?.title,
              description: item.snippet?.description,
              videoId: vId,
              thumbnailUrl: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
              duration: detailsMap[vId] || "00:00"
            });
          }
        });
      }
      nextPageToken = itemsRes.data.nextPageToken || "";
    } while (nextPageToken);

    res.status(200).json({
      success: true,
      playlist: {
        title: playlistDetails.title,
        description: playlistDetails.description,
        thumbnailUrl: playlistDetails.thumbnails?.maxres?.url || playlistDetails.thumbnails?.high?.url || playlistDetails.thumbnails?.default?.url,
      },
      videos
    });
  })
);

// ==========================
// Fetch Single YouTube Video for Admin Course Builder
// ==========================
router.get(
  "/fetch-video/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const videoId = req.params.id;
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";

    const videoRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
    );
    
    const item = videoRes.data.items?.[0];
    if (!item) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    res.status(200).json({
      success: true,
      video: {
        title: item.snippet?.title,
        description: item.snippet?.description,
        videoId: item.id,
        thumbnailUrl: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
        duration: parseDuration(item.contentDetails?.duration) || "00:00"
      }
    });
  })
);

// ==========================
// Fetch All Channel Playlists
// ==========================
router.get(
  "/fetch-channel-playlists",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";
    const channelId = process.env.YOUTUBE_CHANNEL_ID || "UC5lX2UJ-nbyGYT6WYlhQskQ";

    let playlists = [];
    let nextPageToken = "";

    do {
      const playlistRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
      );
      
      const items = playlistRes.data.items || [];
      items.forEach(item => {
        playlists.push({
          id: item.id,
          title: item.snippet?.title,
          description: item.snippet?.description,
          thumbnailUrl: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
          videoCount: item.contentDetails?.itemCount || 0
        });
      });

      nextPageToken = playlistRes.data.nextPageToken || "";
    } while (nextPageToken);

    res.status(200).json({
      success: true,
      playlists
    });
  })
);

// ==========================
// Fetch YouTube Channel Details by ID
// ==========================
router.get(
  "/channel/:channelId",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBNXDxfkCEYgfwn0cYZ5iYyDOVZzu-XW2I";

    try {
      const channelRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      
      const item = channelRes.data.items?.[0];
      if (!item) {
        return res.status(404).json({ success: false, message: "YouTube channel not found. Please check the ID." });
      }

      const channelData = {
        name: item.snippet?.title || "Unknown Channel",
        description: item.snippet?.description || "",
        avatar: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || "",
        subscribers: item.statistics?.subscriberCount || "0",
        videos: item.statistics?.videoCount || "0",
        url: `https://youtube.com/channel/${channelId}`
      };

      res.status(200).json({
        success: true,
        channel: channelData
      });
    } catch (error) {
      console.error("YouTube Channel Fetch Error:", error.response?.data || error.message);
      res.status(500).json({ success: false, message: "Failed to fetch channel data from YouTube API." });
    }
  })
);

module.exports = router;
