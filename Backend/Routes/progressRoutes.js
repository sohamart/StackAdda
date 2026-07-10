const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const {
  saveProgress,
  getProgress,
  completeLesson,
  updateCourseProgress,
  continueLearning,
} = require("../Controllers/progressController");

router.post(
  "/save",
  authMiddleware,
  saveProgress
);

router.get(
  "/:courseId",
  authMiddleware,
  getProgress
);

router.post(
  "/complete-lesson",
  authMiddleware,
  completeLesson
);

router.post(
  "/update",
  authMiddleware,
  updateCourseProgress
);

router.get(
  "/continue/:courseId",
  authMiddleware,
  continueLearning
);

module.exports = router;