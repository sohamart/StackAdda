const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

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
  roleMiddleware("student"),
  saveProgress
);

router.get(
  "/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  getProgress
);

router.post(
  "/complete-lesson",
  authMiddleware,
  roleMiddleware("student"),
  completeLesson
);

router.post(
  "/update",
  authMiddleware,
  roleMiddleware("student"),
  updateCourseProgress
);

router.get(
  "/continue/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  continueLearning
);

module.exports = router;
