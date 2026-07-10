const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index(
  {
    student: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Review",
  ReviewSchema
);