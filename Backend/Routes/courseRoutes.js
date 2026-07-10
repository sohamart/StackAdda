const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const upload = require("../Config/multer");

const {
  createCourse,
  updateCourse,
  deleteCourse,
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
    assignCourse,
    removeAssignedCourse,
    enrollFreeCourse,
    getMyCourses,
} = require("../Controllers/courseController");


// ============================
// Admin
// ============================

router.post(
  "/admin/course",
  authMiddleware,
  upload.single("thumbnail"),
  createCourse
);

router.put(
  "/course/:id",
  authMiddleware,
  upload.single("thumbnail"),
  updateCourse
);

router.delete(
  "/course/:id",
  authMiddleware,
  deleteCourse
);

router.get(
  "/courses",
  authMiddleware,
  getAllCourses
);
// Home Courses

router.get(
  "/home",
  getHomeCourses
);

router.get(
  "/all",
  getPublishedCourses
);


router.get(
  "/:slug",
  getSingleCourse
);

router.post(
  "/course/:courseId/chapter",
  authMiddleware,
  addChapter
);

router.put(
  "/course/:courseId/chapter/:chapterId",
  authMiddleware,
  updateChapter
);

router.delete(
  "/course/:courseId/chapter/:chapterId",
  authMiddleware,
  deleteChapter
);

router.post(
  "/course/:courseId/chapter/:chapterId/lesson",
  authMiddleware,
  upload.single("video"),
  addLesson
);

router.put(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId",
  authMiddleware,
  upload.single("video"),
  updateLesson
);
router.delete(
  "/course/:courseId/chapter/:chapterId/lesson/:lessonId",
  authMiddleware,
  deleteLesson
);
router.post(
  "/course/assign",
  authMiddleware,
  assignCourse
);
router.delete(
  "/course/remove",
  authMiddleware,
  removeAssignedCourse
);

router.post(
  "/enroll/:courseId",
  authMiddleware,
  enrollFreeCourse
);
router.get(
  "/my-courses",
  authMiddleware,
  getMyCourses
);

module.exports = router;