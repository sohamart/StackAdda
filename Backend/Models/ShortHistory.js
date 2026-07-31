const mongoose = require("mongoose");

const shortHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Short",
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    watchDuration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShortHistory", shortHistorySchema);
