const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Review = require("../Models/Review");
const authMiddleware = require("../Middleware/authMiddleware");

// Default fake reviews
const FAKE_REVIEWS = [
  {
    name: "Riya Das",
    text: "The lessons are clear, structured and easy to follow. I finally built my first real project.",
    role: "Frontend Learner",
    rating: 5,
    createdAt: new Date("2026-07-10T10:00:00.000Z")
  },
  {
    name: "Arjun Saha",
    text: "The learning dashboard makes it simple to stay focused and track every lesson.",
    role: "DSA Learner",
    rating: 5,
    createdAt: new Date("2026-07-15T12:00:00.000Z")
  },
  {
    name: "Priya Roy",
    text: "A premium learning experience with genuinely practical course content.",
    role: "Web Development Learner",
    rating: 5,
    createdAt: new Date("2026-07-20T14:00:00.000Z")
  },
  {
    name: "Sourav Modak",
    text: "Stack Adda has completely changed how I learn programming. The live chats are incredibly helpful.",
    role: "Full-stack Developer",
    rating: 5,
    createdAt: new Date("2026-07-22T09:00:00.000Z")
  },
  {
    name: "Sneha Sen",
    text: "Clear explanations of core programming concepts. Highly recommend to any beginner out there.",
    role: "Backend Student",
    rating: 5,
    createdAt: new Date("2026-07-24T16:00:00.000Z")
  }
];

// ==========================
// Get All Reviews (DB + Fake)
// ==========================
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const dbReviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    
    // Combine db reviews and fake reviews
    const reviews = [...dbReviews, ...FAKE_REVIEWS];
    res.status(200).json({ success: true, reviews });
  })
);

// ==========================
// Submit a Review (Protected)
// ==========================
router.post(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { text, rating, role } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Review text cannot be empty." });
    }

    const reviewRating = parseInt(rating, 10) || 5;

    const newReview = await Review.create({
      name: req.user.name,
      role: role || "Student Learner",
      text: text.trim(),
      rating: reviewRating
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been published.",
      review: newReview
    });
  })
);

module.exports = router;
