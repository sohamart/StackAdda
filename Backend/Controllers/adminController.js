const User = require("../Models/User");
const asyncHandler = require("express-async-handler");

// Dashboard
const dashboard = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({
    role: "student",
  });

  const totalAdmins = await User.countDocuments({
    role: "admin",
  });

  const verifiedStudents = await User.countDocuments({
    role: "student",
    isVerified: true,
  });

  const unverifiedStudents = await User.countDocuments({
    role: "student",
    isVerified: false,
  });

  const recentStudents = await User.find({
    role: "student",
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("-password");

  res.status(200).json({
    success: true,

    stats: {
      totalStudents,
      totalAdmins,
      verifiedStudents,
      unverifiedStudents,
    },

    recentStudents,
  });
});

// Get All Students
const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");

  res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});

// Get Single Student
const getStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  }).select("-password");

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// Delete Student
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // যদি Cloudinary profile image থাকে তাহলে delete
  if (student.profileImage?.public_id) {
    const cloudinary = require("../Config/cloudinary");
    await cloudinary.uploader.destroy(student.profileImage.public_id);
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});

module.exports = {
  dashboard,
  getStudents,
  getStudent,
  deleteStudent,
};