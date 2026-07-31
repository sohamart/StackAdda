const mongoose = require("mongoose");

const shortNotificationSchema = new mongoose.Schema(
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
    },
    type: {
      type: String,
      enum: ["like", "comment", "share"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShortNotification", shortNotificationSchema);
