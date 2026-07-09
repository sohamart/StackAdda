const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  dashboard,
  getStudents,
  getStudent,
  deleteStudent,
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

module.exports = router;