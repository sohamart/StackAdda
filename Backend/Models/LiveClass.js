const mongoose = require("mongoose");

const LiveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Live Class Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    facultyName: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    streamUrl: {
      type: String,
      default: "",
    },
    expectedEndTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Upcoming",
        "Waiting for Host",
        "Starting",
        "Live",
        "Paused",
        "Ended",
        "Cancelled",
        "Completed",
      ],
      default: "Upcoming",
    },

    // Media
    thumbnail: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    banner: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    introVideoUrl: {
      type: String,
      default: "",
    },

    // Meeting Settings
    waitingRoomEnabled: { type: Boolean, default: true },
    recordingEnabled: { type: Boolean, default: false },
    chatEnabled: { type: Boolean, default: true },
    raiseHandEnabled: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 0 }, // 0 = unlimited
    notificationsEnabled: { type: Boolean, default: true },

    // Live Stream details
    streamUrl: { type: String },

    // Analytics
    attendance: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinTime: { type: Date },
        leaveTime: { type: Date },
        durationSeconds: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveClass", LiveClassSchema);
