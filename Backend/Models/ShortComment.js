const mongoose = require("mongoose");

const shortCommentSchema = new mongoose.Schema(
  {
    shortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Short",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShortComment", shortCommentSchema);
