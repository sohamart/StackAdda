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

const editStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const updatedStudent = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    student: updatedStudent,
  });
});

const verifyStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  student.isVerified = true;
  await student.save();

  res.status(200).json({
    success: true,
    message: "Student verified successfully",
  });
});

const unverifyStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  student.isVerified = false;
  await student.save();

  res.status(200).json({
    success: true,
    message: "Student unverified successfully",
  });
});


const getVerifiedStudents = asyncHandler(async (req, res) => {  
  const verifiedStudents = await User.find({
    role: "student",
    isVerified: true,
  }).select("-password");

  res.status(200).json({
    success: true,
    count: verifiedStudents.length,
    verifiedStudents,
  });
});


const getUnverifiedStudents = asyncHandler(async (req, res) => {  
  const unverifiedStudents = await User.find({
    role: "student",
    isVerified: false,
  }).select("-password");
  res.status(200).json({
    success: true,
    count: unverifiedStudents.length,
    unverifiedStudents,
  });
});

const uploadStudentProfileImage = asyncHandler(async (req, res) => {
try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

  const user = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
// Delete old image
    if (user.profileImage.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer);

    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });
  } catch (error) {
  console.error("Profile Image Upload Error:");
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}

});

module.exports = {
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
};