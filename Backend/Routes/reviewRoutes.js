const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
} = require("../Controllers/reviewController");

// Add Review

router.post(
  "/",
  authMiddleware,
  addReview
);

// Update Review

router.put(
  "/:id",
  authMiddleware,
  updateReview
);

// Delete Review

router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

// Get Reviews By Course

router.get(
  "/course/:courseId",
  getCourseReviews
);

module.exports = router;