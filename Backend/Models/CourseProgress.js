const mongoose = require("mongoose");

const LessonProgressSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    watchTime: {
      type: Number,
      default: 0,
    },

    completedAt: Date,
  },
  {
    _id: false,
  }
);

const CourseProgressSchema = new mongoose.Schema(
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

    lessons: [LessonProgressSchema],

    progress: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    lastLesson: {
      chapterId: mongoose.Schema.Types.ObjectId,
      lessonId: mongoose.Schema.Types.ObjectId,
    },

    lastWatchTime: {
      type: Number,
      default: 0,
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CourseProgress",
  CourseProgressSchema
);