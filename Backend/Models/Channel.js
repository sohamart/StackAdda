const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      required: true,
    },
    subscribers: {
      type: String,
      default: "0",
    },
    videos: {
      type: String,
      default: "0",
    },
    status: {
      type: String,
      enum: ["Published", "Coming Soon"],
      default: "Coming Soon",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);
