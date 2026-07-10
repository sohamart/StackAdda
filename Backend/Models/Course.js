const mongoose = require("mongoose");

// ==========================
// Lesson Schema
// ==========================

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    video: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    duration: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },
    averageRating: {
  type: Number,
  default: 0,
},

totalReviews: {
  type: Number,
  default: 0,
},

    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

// ==========================
// Chapter Schema
// ==========================

const ChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },

    lessons: [LessonSchema],
  },
  {
    _id: true,
  }
);

// ==========================
// Course Schema
// ==========================

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    instructor: {
      type: String,
      default: "Stack Adda",
    },

    duration: {
      type: String,
      default: "",
    },

    accessType: {
      type: String,
      enum: [
        "free",
        "paid",
        "private",
      ],
      default: "free",
    },

    price: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
      ],
      default: "draft",
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    chapters: [ChapterSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Course",
  CourseSchema
);