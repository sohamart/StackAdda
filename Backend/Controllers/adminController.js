const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../Config/cloudinary");
const streamifier = require("streamifier");
const sendEmail = require("../Utils/sendEmail");
const { getAdminMessageEmail } = require("../Utils/emailTemplates");

/* Upload to Cloudinary */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "stackadda/profiles",
        width: 400,
        height: 400,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

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

// Get All Students (And Admins)
const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});

// Register a Student (Admin)
const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  let finalRole = "student";
  let isVerified = false;

  if (role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount >= 3) {
      res.status(400);
      throw new Error("Maximum of 3 admins are allowed.");
    }
    finalRole = "admin";
    isVerified = true;
  }

  const student = await User.create({
    name,
    email,
    password,
    phone,
    role: finalRole,
    isVerified,
  });

  if (finalRole === "student") {
    const verificationToken = require("jsonwebtoken").sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: student.email,
      subject: "Verify Your Stack Adda Account",
      html: require("../Utils/emailTemplates").getVerificationEmail(student.name, verifyUrl),
    });
  }

  if (student) {
    res.status(201).json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid student data.");
  }
});

// Get Single Student
const getStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
  })
.populate("verifiedBy", "name email profileImage")
.select("-password");

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
const verifyStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "This user is not a student.",
      });
    }

    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Student is already verified.",
      });
    }

    student.isVerified = true;
    student.verifiedBy = req.user._id;
    student.verifiedAt = new Date();

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student verified successfully.",
      student,
    });
  } catch (error) {
    console.error("Verify Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const unverifyStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "This user is not a student.",
      });
    }

    if (!student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Student is already unverified.",
      });
    }

    student.isVerified = false;
    student.verifiedBy = null;
    student.verifiedAt = null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student verification removed successfully.",
      student,
    });
  } catch (error) {
    console.error("Unverify Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Verify All Students
const verifyAllStudents = asyncHandler(async (req, res) => {
  const result = await User.updateMany(
    { role: "student", isVerified: false },
    { $set: { isVerified: true, verifiedBy: req.user._id } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} students verified successfully`,
  });
});

// Send Broadcast Email
const sendBroadcastEmail = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error("Please provide both subject and message.");
  }

  const students = await User.find({ role: "student" }).select("email name");

  if (students.length === 0) {
    res.status(400);
    throw new Error("No students found to send email to.");
  }

  // To prevent timeout and memory limit, map over students and send emails in background or small chunks
  // For simplicity and to ensure delivery, we will map over them and await
  const emailPromises = students.map((student) => {
    return sendEmail({
      to: student.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111113; color: white; border-radius: 10px; overflow: hidden; border: 1px solid #333;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Stack Adda</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #f97316; font-size: 20px; margin-top: 0;">Hello ${student.name},</h2>
            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="background-color: #000; padding: 15px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Stack Adda. All rights reserved.</p>
          </div>
        </div>
      `,
    }).catch(err => {
      console.error(`Failed to send email to ${student.email}:`, err.message);
    });
  });

  await Promise.all(emailPromises);

  res.status(200).json({
    success: true,
    message: `Broadcast email sent successfully to ${students.length} students.`,
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

const emailStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: "Student not found." });

  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ success: false, message: "Subject and message are required." });

  const sent = await sendEmail({ to: student.email, subject, html: getAdminMessageEmail(subject, message) });
  if (!sent) return res.status(503).json({ success: false, message: "Email service is not configured. Add SMTP settings in Backend/.env." });
  res.json({ success: true, message: `Email sent to ${student.email}.` });
});

const broadcastEmail = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ success: false, message: "Subject and message are required." });

  const students = await User.find({ role: "student" }).select("email");
  if (!students.length) return res.status(404).json({ success: false, message: "No students found." });

  const html = getAdminMessageEmail(subject, message);
  let successCount = 0;

  for (const student of students) {
    const sent = await sendEmail({ to: student.email, subject, html });
    if (sent) successCount++;
  }

  res.status(200).json({
    success: true,
    message: `Broadcast sent to ${successCount}/${students.length} students.`,
  });
});

module.exports = {
  dashboard,
  getStudents,
  registerStudent,
  getStudent,
  deleteStudent,
  editStudent,
  verifyStudent,
  unverifyStudent,
  verifyAllStudents,
  sendBroadcastEmail,
  getVerifiedStudents,
  getUnverifiedStudents,
  uploadStudentProfileImage,
  emailStudent,
  broadcastEmail,
};
