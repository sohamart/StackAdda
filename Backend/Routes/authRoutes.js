const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  logout,
    adminLogin,
  googleLogin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../Controllers/authController");

const authMiddleware = require("../Middleware/authMiddleware");

// Student
router.post("/student/register", register);

router.post("/student/login", login);
router.post("/student/google", googleLogin);

// Admin
router.post("/admin/login", adminLogin);

// Common
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

// Verification & Reset
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", authMiddleware, resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
