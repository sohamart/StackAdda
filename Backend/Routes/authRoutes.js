const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  logout,
    adminLogin,
} = require("../Controllers/authController");

const authMiddleware = require("../Middleware/authMiddleware");

// Student
router.post("/student/register", register);
router.post("/student/login", login);

// Admin
router.post("/admin/login", adminLogin);

// Common
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

module.exports = router;