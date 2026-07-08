const express = require("express");
const authMiddleware = require("../Middleware/AuthMiddleware");

const {
  studentRegister,
  studentLogin,
  adminLogin,
  adminRegister,
    getAllStudents,
    getAllAdmins,
    getStudentById,
    getAdminById,
    loggedInStudent,
    loggedInAdmin,
} = require("../Controllers/AuthController");

const router = express.Router();

// Student
router.post("/student/register", studentRegister);
router.post("/student/login", studentLogin);
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.get("/student/me", authMiddleware, loggedInStudent);


// Admin
router.post("/admin/login", adminLogin);
router.post("/admin/register", adminRegister);
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.get("/admin/me", authMiddleware, loggedInAdmin);

module.exports = router;