
const asyncHandler = require("express-async-handler");

const Review = require("../Models/Review");
const Course = require("../Models/Course");
const User = require("../Models/User");

// ==========================
// Add Review
// ==========================

const addReview = asyncHandler(async (req, res) => {

  const { courseId, rating, review } = req.body;

  if (!courseId || !rating) {
    return res.status(400).json({
      success: false,
      message: "Course and rating are required.",
    });
  }

  const student = await User.findById(req.user._id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  if (
    !student.enrolledCourses.some(id =>
      id.equals(courseId)
    )
  ) {
    return res.status(403).json({
      success: false,
      message: "Enroll in this course first.",
    });
  }

  const exists = await Review.findOne({
    student: student._id,
    course: courseId,
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "You already reviewed this course.",
    });
  }

  const newReview = await Review.create({
    student: student._id,
    course: courseId,
    rating,
    review,
  });

  const reviews = await Review.find({
    course: courseId,
  });

  const total =
    reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

  await Course.findByIdAndUpdate(courseId, {
    averageRating:
      total / reviews.length,
    totalReviews: reviews.length,
  });

  res.status(201).json({
    success: true,
    message: "Review added successfully.",
    review: newReview,
  });

});

// ==========================
// Update Review
// ==========================

const updateReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(
    req.params.id
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found.",
    });
  }

  if (
    review.student.toString() !==
    req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  review.rating =
    req.body.rating ?? review.rating;

  review.review =
    req.body.review ?? review.review;

  await review.save();

  const reviews = await Review.find({
    course: review.course,
  });

  const total =
    reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

  await Course.findByIdAndUpdate(
    review.course,
    {
      averageRating:
        total / reviews.length,
      totalReviews: reviews.length,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully.",
    review,
  });

});

// ==========================
// Delete Review
// ==========================

const deleteReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(
    req.params.id
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found.",
    });
  }

  if (
    review.student.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  const courseId = review.course;

  await review.deleteOne();

  const reviews = await Review.find({
    course: courseId,
  });

  const total =
    reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

  await Course.findByIdAndUpdate(courseId, {
    averageRating:
      reviews.length === 0
        ? 0
        : total / reviews.length,
    totalReviews: reviews.length,
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
  });

});

// ==========================
// Get Course Reviews
// ==========================

const getCourseReviews = asyncHandler(async (req, res) => {

  const reviews = await Review.find({
    course: req.params.courseId,
  })
    .populate(
      "student",
      "name profileImage"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });

});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
};