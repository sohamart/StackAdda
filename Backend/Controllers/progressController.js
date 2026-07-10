const asyncHandler = require("express-async-handler");

const Course = require("../Models/Course");
const User = require("../Models/User");
const CourseProgress = require("../Models/CourseProgress");


// ==========================
// Save Progress
// ==========================

const saveProgress = asyncHandler(async (req, res) => {

  const {
    courseId,
    chapterId,
    lessonId,
    watchTime,
  } = req.body;

  if (
    !courseId ||
    !chapterId ||
    !lessonId
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  const student = await User.findById(req.user._id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  
  if (
  !student.enrolledCourses.some((id) =>
    id.equals(course._id)
  )
){
    return res.status(403).json({
      success: false,
      message: "You are not enrolled.",
    });
  }

  let progress =
    await CourseProgress.findOne({
      student: student._id,
      course: courseId,
    });

  if (!progress) {

    progress =
      await CourseProgress.create({
        student: student._id,
        course: courseId,
      });

  }

  progress.lastLesson = {
    chapterId,
    lessonId,
  };

  progress.lastWatchTime =
    watchTime || 0;
      const lessonProgress =
    progress.lessons.find(
      (lesson) =>
        lesson.lessonId.toString() ===
        lessonId
    );

  if (lessonProgress) {

    lessonProgress.watchTime =
      watchTime || 0;

  } else {

    progress.lessons.push({
      lessonId,
      watchTime: watchTime || 0,
      completed: false,
    });

  }

  await progress.save();

  res.status(200).json({
    success: true,
    message: "Progress saved.",
    progress,
  });

});
// ==========================
// Get Progress
// ==========================

const getProgress = asyncHandler(async (req, res) => {

  const progress =
    await CourseProgress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: "Progress not found.",
    });
  }

  res.status(200).json({
    success: true,
    progress,
  });

});

// ==========================
// Complete Lesson
// ==========================

const completeLesson = asyncHandler(async (req, res) => {

  const { courseId, lessonId } = req.body;

  const progress = await CourseProgress.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: "Progress not found.",
    });
  }

  const lesson = progress.lessons.find(
    (item) =>
      item.lessonId.toString() === lessonId
  );

  if (!lesson) {

    progress.lessons.push({
      lessonId,
      completed: true,
      completedAt: new Date(),
      watchTime: progress.lastWatchTime,
    });

  } else {

    lesson.completed = true;
    lesson.completedAt = new Date();

  }

  await progress.save();

  res.status(200).json({
    success: true,
    message: "Lesson completed successfully.",
  });

});

// ==========================
// Update Course Progress
// ==========================

const updateCourseProgress = asyncHandler(async (req, res) => {

  const { courseId } = req.body;

  const progress = await CourseProgress.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: "Progress not found.",
    });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  let totalLessons = 0;

  course.chapters.forEach((chapter) => {
    totalLessons += chapter.lessons.length;
  });

  const completedLessons =
    progress.lessons.filter(
      (lesson) => lesson.completed
    ).length;

  progress.progress =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons / totalLessons) * 100
        );

  if (progress.progress === 100) {
    progress.completed = true;
    progress.completedAt = new Date();
  }

  await progress.save();

  res.status(200).json({
    success: true,
    progress: progress.progress,
    completed: progress.completed,
  });

});

// ==========================
// Continue Learning
// ==========================

const continueLearning = asyncHandler(async (req, res) => {

  const progress =
    await CourseProgress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: "Progress not found.",
    });
  }

  res.status(200).json({
    success: true,
    lastLesson: progress.lastLesson,
    lastWatchTime: progress.lastWatchTime,
  });

});

module.exports = {
  saveProgress,
  getProgress,
  completeLesson,
  updateCourseProgress,
  continueLearning,
};