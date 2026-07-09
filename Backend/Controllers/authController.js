const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../Utils/generateToken");
const sendToken = require("../Utils/sendToken");



/* ===========================
   Student Register
=========================== */

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "student",
  });

  sendToken(user, 201, res, "Registration successful.");
});

/* ===========================
   Student Login
=========================== */

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (user.role !== "student") {
    res.status(403);
    throw new Error("Student account required.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  sendToken(user, 200, res, "Login successful.");
});
const adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required.");
    }

    const user = await User.findOne({
        email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
        res.status(401);
        throw new Error("Invalid credentials.");
    }

    if (user.role !== "admin") {
        res.status(403);
        throw new Error("Admin account required.");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials.");
    }

    sendToken(user, 200, res, "Admin login successful.");
});
/* ===========================
   Current User
=========================== */

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/* ===========================
   Logout
=========================== */

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
    adminLogin,
};