const Channel = require("../Models/Channel");
const asyncHandler = require("express-async-handler");

// @desc    Get all channels
// @route   GET /api/channels
// @access  Public (or Admin depending on use, we'll keep it public for the Channels page)
exports.getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({});
  res.status(200).json({ success: true, channels });
});

// @desc    Create a channel
// @route   POST /api/channels
// @access  Private/Admin
exports.createChannel = asyncHandler(async (req, res) => {
  const { name, description, url, avatar, subscribers, videos, status, featured } = req.body;

  const channel = await Channel.create({
    name,
    description,
    url,
    avatar,
    subscribers,
    videos,
    status: status || "Coming Soon",
    featured: featured || false,
  });

  res.status(201).json({ success: true, channel });
});

// @desc    Update a channel
// @route   PUT /api/channels/:id
// @access  Private/Admin
exports.updateChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (channel) {
    channel.name = req.body.name || channel.name;
    channel.description = req.body.description || channel.description;
    channel.url = req.body.url ?? channel.url;
    channel.avatar = req.body.avatar || channel.avatar;
    channel.subscribers = req.body.subscribers || channel.subscribers;
    channel.videos = req.body.videos || channel.videos;
    channel.status = req.body.status || channel.status;
    
    if (req.body.featured !== undefined) {
      channel.featured = req.body.featured;
    }

    const updatedChannel = await channel.save();
    res.status(200).json({ success: true, channel: updatedChannel });
  } else {
    res.status(404);
    throw new Error("Channel not found");
  }
});

// @desc    Delete a channel
// @route   DELETE /api/channels/:id
// @access  Private/Admin
exports.deleteChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (channel) {
    await channel.deleteOne();
    res.status(200).json({ success: true, message: "Channel removed" });
  } else {
    res.status(404);
    throw new Error("Channel not found");
  }
});
