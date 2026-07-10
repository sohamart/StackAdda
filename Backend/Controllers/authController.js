const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../Utils/generateToken");
const sendToken = require("../Utils/sendToken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../Utils/sendEmail");

const googleClient = new OAuth2Client();



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

  await sendEmail({
    to: user.email,
    subject: "Welcome to Stack Adda",
    html: `<h2>Welcome, ${user.name}!</h2><p>Your Stack Adda student account is ready. Start exploring courses and building skills.</p>`,
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
   Student Google Login
=========================== */
const googleLogin = asyncHandler(async (req, res) => {
  const { credential, clientId: browserClientId } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID || (
    process.env.NODE_ENV !== "production" ? browserClientId : null
  );

  if (!credential) {
    return res.status(400).json({ success: false, message: "Google credential is required." });
  }
  if (!clientId) {
    return res.status(500).json({ success: false, message: "Google sign-in is not configured." });
  }

  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    return res.status(401).json({ success: false, message: "Google account email could not be verified." });
  }

  let user = await User.findOne({ email: payload.email.toLowerCase() }).select("+password");

  if (user && user.role !== "student") {
    return res.status(403).json({ success: false, message: "Please use the admin login for this account." });
  }

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      password: crypto.randomBytes(32).toString("hex"),
      googleId: payload.sub,
      role: "student",
      profileImage: { url: payload.picture || "", public_id: "" },
    });
    await sendEmail({
      to: user.email,
      subject: "Welcome to Stack Adda",
      html: `<h2>Welcome, ${user.name}!</h2><p>Your account was created with Google sign-in. Happy learning!</p>`,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (!user.profileImage?.url && payload.picture) user.profileImage.url = payload.picture;
    await user.save();
  }

  sendToken(user, 200, res, "Google login successful.");
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
    googleLogin,
};
