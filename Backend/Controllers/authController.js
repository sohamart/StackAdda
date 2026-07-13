const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../Utils/generateToken");
const sendToken = require("../Utils/sendToken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../Utils/sendEmail");
const { getWelcomeEmail } = require("../Utils/emailTemplates");

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
    isVerified: false,
  });

  const verificationToken = require("jsonwebtoken").sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Stack Adda Account",
    html: require("../Utils/emailTemplates").getVerificationEmail(user.name, verifyUrl),
  });

  sendToken(user, 201, res, "Registration successful. Please check your email to verify your account.");
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

/* ===========================
   Admin Login
=========================== */

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
    return res.status(401).json({ success: false, message: "Account not found. Please register first." });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.isVerified = true;
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

/* ===========================
   Verify Email
=========================== */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400);
    throw new Error("Verification token is missing.");
  }

  try {
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Email already verified." });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    res.status(200).json({ success: true, message: "Email successfully verified!" });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid or expired verification token.");
  }
});

/* ===========================
   Resend Verification Email
=========================== */
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.isVerified) {
    res.status(400);
    throw new Error("Email is already verified.");
  }

  const verificationToken = require("jsonwebtoken").sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Stack Adda Account",
    html: require("../Utils/emailTemplates").getVerificationEmail(user.name, verifyUrl),
  });

  res.status(200).json({ success: true, message: "Verification email sent successfully." });
});

/* ===========================
   Forgot Password
=========================== */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address.");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error("No user found with that email.");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: require("../Utils/emailTemplates").getPasswordResetEmail(resetUrl),
    });

    res.status(200).json({ success: true, message: "Password reset email sent." });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("Email could not be sent.");
  }
});

/* ===========================
   Reset Password
=========================== */
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token.");
  }

  const { password } = req.body;
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res, "Password reset successful.");
});

module.exports = {
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
};
