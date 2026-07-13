const LiveClass = require("../Models/LiveClass");
const Course = require("../Models/Course");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../Config/cloudinary");

const uploadVideoToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "live_class_intros", resource_type: "video" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// ==========================
// Create Live Class
// ==========================
const createLiveClass = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found." });
  }

  let finalIntroUrl = req.body.introVideoUrl || "";

  if (req.file) {
    try {
      const result = await uploadVideoToCloudinary(req.file.buffer);
      finalIntroUrl = result.secure_url;
    } catch (err) {
      return res.status(500).json({ success: false, message: "Failed to upload video to Cloudinary" });
    }
  }

  const liveClass = await LiveClass.create({
    ...req.body,
    introVideoUrl: finalIntroUrl,
    course: courseId,
    host: req.user._id,
  });

  // Emit socket event
  const io = req.app.get("io");
  io.to(`course_${courseId}`).emit("class_created", liveClass);

  res.status(201).json({ success: true, liveClass });
});

// ==========================
// Get Live Classes for a Course (Admin)
// ==========================
const getCourseLiveClasses = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const liveClasses = await LiveClass.find({ course: courseId }).sort({ date: -1, createdAt: -1 });

  res.status(200).json({ success: true, liveClasses });
});

// ==========================
// Get Active/Upcoming Live Classes (Student)
// ==========================
const getActiveLiveClasses = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Students shouldn't see classes that are entirely "Completed" or "Ended" far in the past unless they want to see recordings.
  // For now, let's return all, and the frontend will filter based on status.
  const liveClasses = await LiveClass.find({ course: courseId }).sort({ date: -1 });

  res.status(200).json({ success: true, liveClasses });
});

// ==========================
// Get Single Live Class
// ==========================
const getLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  res.status(200).json({ success: true, liveClass });
});

// ==========================
// Update Live Class
// ==========================
const updateLiveClass = asyncHandler(async (req, res) => {
  let liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const io = req.app.get("io");
  io.to(`course_${liveClass.course}`).emit("class_updated", liveClass);

  res.status(200).json({ success: true, liveClass });
});

// ==========================
// Delete Live Class
// ==========================
const deleteLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  const courseId = liveClass.course;
  const classId = liveClass._id;

  await liveClass.deleteOne();

  const io = req.app.get("io");
  io.to(`course_${courseId}`).emit("class_cancelled", classId);

  res.status(200).json({ success: true, message: "Live Class deleted." });
});

// ==========================
// Change Live Class Status (Start, Pause, End)
// ==========================
const changeClassStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  const validStatuses = [
    "Upcoming",
    "Waiting for Host",
    "Starting",
    "Live",
    "Paused",
    "Ended",
    "Cancelled",
    "Completed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status." });
  }

  liveClass.status = status;
  if (req.body.streamUrl) {
    liveClass.streamUrl = req.body.streamUrl;
  }
  
  await liveClass.save();

  const io = req.app.get("io");
  
  // Specific events based on status
  if (status === "Live") {
    io.to(`course_${liveClass.course}`).emit("class_started", liveClass);
  } else if (status === "Paused") {
    io.to(`course_${liveClass.course}`).emit("class_paused", liveClass);
  } else if (status === "Ended" || status === "Completed") {
    io.to(`course_${liveClass.course}`).emit("class_ended", liveClass);
  } else {
    io.to(`course_${liveClass.course}`).emit("class_status_changed", liveClass);
  }

  res.status(200).json({ success: true, liveClass });
});

// ==========================
// Start Live Stream
// ==========================
const startStream = asyncHandler(async (req, res) => {
  const { streamUrl } = req.body;
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  if (!streamUrl) {
    return res.status(400).json({ success: false, message: "Stream URL is required." });
  }

  liveClass.streamUrl = streamUrl;
  liveClass.status = "Live";
  await liveClass.save();

  const io = req.app.get("io");
  io.to(`course_${liveClass.course}`).emit("class_started", liveClass);
  io.to(`course_${liveClass.course}`).emit("class_status_changed", liveClass);

  res.status(200).json({ success: true, liveClass });
});

// ==========================
// Log Student Attendance
// ==========================
const logAttendance = asyncHandler(async (req, res) => {
  const { action } = req.body; // "join" or "leave"
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    return res.status(404).json({ success: false, message: "Live Class not found." });
  }

  const studentId = req.user._id;

  if (action === "join") {
    // Check if already joined and didn't leave properly
    const existingIndex = liveClass.attendance.findIndex(
      (a) => a.student.equals(studentId) && !a.leaveTime
    );

    if (existingIndex === -1) {
      liveClass.attendance.push({ student: studentId, joinTime: new Date() });
    }
  } else if (action === "leave") {
    const existingIndex = liveClass.attendance.findIndex(
      (a) => a.student.equals(studentId) && !a.leaveTime
    );

    if (existingIndex !== -1) {
      const joinTime = new Date(liveClass.attendance[existingIndex].joinTime);
      const leaveTime = new Date();
      const duration = Math.round((leaveTime - joinTime) / 1000); // seconds

      liveClass.attendance[existingIndex].leaveTime = leaveTime;
      liveClass.attendance[existingIndex].durationSeconds += duration;
    }
  }

  await liveClass.save();

  res.status(200).json({ success: true });
});

module.exports = {
  createLiveClass,
  getCourseLiveClasses,
  getActiveLiveClasses,
  getLiveClass,
  updateLiveClass,
  deleteLiveClass,
  changeClassStatus,
  startStream,
  logAttendance,
};
