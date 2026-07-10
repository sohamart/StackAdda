const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  dashboard,
  getStudents,
  getStudent,
  deleteStudent,
  editStudent,
  verifyStudent,
  unverifyStudent,
  getVerifiedStudents,
  getUnverifiedStudents,
  uploadStudentProfileImage,
} = require("../Controllers/adminController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  dashboard
);

router.get(
  "/students",
  authMiddleware,
  roleMiddleware("admin"),
  getStudents
);

router.get(
  "/student/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getStudent
);

router.delete(
  "/student/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteStudent
);

router.put(
  "/student/:id",
  authMiddleware,
  roleMiddleware("admin"),
  editStudent
);

router.put(
  "/student/:id/profile-image",
  authMiddleware,
  roleMiddleware("admin"),
  uploadStudentProfileImage
);

router.put(
  "/student/:id/verify",
  authMiddleware,
  roleMiddleware("admin"),
  verifyStudent
);

router.put(
  "/student/:id/unverify",
  authMiddleware,
  roleMiddleware("admin"),
  unverifyStudent
);

router.get(
  "/verified-students",
  authMiddleware,
  roleMiddleware("admin"),
  getVerifiedStudents
);
router.get(
  "/unverified-students",
  authMiddleware,
  roleMiddleware("admin"),
  getUnverifiedStudents
);
module.exports = router;