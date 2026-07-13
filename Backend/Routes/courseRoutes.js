const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");
const upload = require("../Config/multer");

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
  getHomeCourses,
  getPublishedCourses,
  getSingleCourse,
  addChapter,
  updateChapter,
  deleteChapter,
  addLesson,
  updateLesson,
  deleteLesson,
  addLessonResource,
  deleteLessonResource,
  downloadLessonResource,
  assignCourse,
  removeAssignedCourse,
  enrollFreeCourse,
  getMyCourses,
  getEnrolledCourse,
} = require("../Controllers/courseController");

// ============================
// Admin
// ============================

router.post(
  "/admin/course",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("thumbnail"),
  createCourse
);

router.put(
  "/course/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("thumbnail"),
  updateCourse
);

router.delete(
  "/course/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCourse
);

router.get(
  "/courses",
  authMiddleware,
  roleMiddleware("admin"),
  getAllCourses
);

router.get(
  "/course/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getCourseById
);

// ============================
// Public / General
// ============================

router.get("/home", getHomeCourses);
router.get("/all", getPublishedCourses);

// ============================
// Chapters & Lessons (Admin)
// ============================

router.post(
  "/course/:courseId/chapter",
  authMiddleware,
  roleMiddleware("admin"),
  addChapter
);

router.put(
  "/course/:courseId/chapter/:chapterId",
  authMiddleware,
  roleMiddleware("admin"),
  updateChapter
);

router.delete(
  "/course/:courseId/chapter/:chapterId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteChapter
);

router.post(
  "/course/:courseId/chapter/:chapterId/lesson",
  authMiddleware,
  roleMiddleware("admin"),
  addLesson
);

router.put(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId",
  authMiddleware,
  roleMiddleware("admin"),
  updateLesson
);

router.delete(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteLesson
);

router.post(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId/resource",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("resource"),
  addLessonResource
);

router.delete(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId/resource/:resourceId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteLessonResource
);

router.get(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId/resource/:resourceId/download",
  authMiddleware,
  downloadLessonResource
);

// ============================
// Enrollments
// ============================

router.post(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignCourse
);

router.delete(
  "/:id/remove/:studentId",
  authMiddleware,
  roleMiddleware("admin"),
  removeAssignedCourse
);

router.post(
  "/enroll/:id",
  authMiddleware,
  roleMiddleware("student"),
  enrollFreeCourse
);

router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware("student"),
  getMyCourses
);

router.get(
  "/learn/:id",
  authMiddleware,
  roleMiddleware("student", "admin"),
  getEnrolledCourse
);



// Catch-all single course get
router.get("/:slug", getSingleCourse);

module.exports = router;
