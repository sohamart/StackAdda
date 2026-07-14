const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const sendEmail = require("../utils/sendEmail");
const { getPiracyAlertAdminEmail, getPiracyWarningStudentEmail } = require("../utils/emailTemplates");

const dashboard = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id)
    .populate("verifiedBy", "name email profileImage")
    .select("-password");

  res.status(200).json({
    success: true,
    message: `Welcome ${student.name}`,
    student,
    dashboard: student,
  });
});

const reportPiracy = asyncHandler(async (req, res) => {
  const student = req.user;
  
  if (!student || student.role === "admin") {
    return res.status(200).json({ success: true });
  }

  // 1. Send warning email to student
  const studentEmailContent = getPiracyWarningStudentEmail(student.name);
  await sendEmail({
    to: student.email,
    subject: "Security Warning: Unauthorized Screen Recording Detected",
    html: studentEmailContent,
  });

  // 2. Send alert email to admin
  const adminEmailContent = getPiracyAlertAdminEmail(student.name, student.email, student._id);
  await sendEmail({
    to: process.env.SMTP_FROM || "admin@example.com", 
    subject: "🚨 Security Alert: Piracy Detected",
    html: adminEmailContent,
  });

  res.status(200).json({ success: true, message: "Piracy reported." });
});

module.exports = {
  dashboard,
  reportPiracy
};
