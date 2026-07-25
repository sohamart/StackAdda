const mongoose = require("mongoose");

const YoutubeVideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String,
      default: "15:00",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("YoutubeVideo", YoutubeVideoSchema);
