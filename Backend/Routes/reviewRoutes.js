const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

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
  roleMiddleware("student"),
  addReview
);

// Update Review

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("student"),
  updateReview
);

// Delete Review

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("student", "admin"),
  deleteReview
);

// Get Reviews By Course

router.get(
  "/course/:courseId",
  getCourseReviews
);

module.exports = router;
