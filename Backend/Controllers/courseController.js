const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const streamifier = require("streamifier");
const validator = require("validator");

const Course = require("../Models/Course");
const User = require("../Models/User");

const cloudinary = require("../Config/cloudinary");
const sendEmail = require("../Utils/sendEmail");

const mimeExtensions = {
  "application/pdf": ".pdf",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "text/plain": ".txt",
};

const sanitizeFileName = (value, fallback = "resource") => {
  const safe = String(value || fallback)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return (safe || fallback).slice(0, 140);
};

const extensionFrom = (fileName = "", mimeType = "") => {
  const extension = path.extname(fileName).toLowerCase();
  return extension || mimeExtensions[mimeType] || "";
};

const buildDownloadFileName = ({ title, fileName, mimeType, url }) => {
  const sourceName =
    fileName ||
    title ||
    (() => {
      try {
        return path.basename(new URL(url).pathname);
      } catch {
        return "";
      }
    })();

  const cleanName = sanitizeFileName(sourceName);
  if (path.extname(cleanName)) return cleanName;

  const extension = extensionFrom(fileName || url, mimeType);
  return extension ? `${cleanName}${extension}` : cleanName;
};

const uploadToCloudinary = (buffer, folder, resource_type = "image", options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const createCourse = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    category,
    level,
    language,
    instructor,
    duration,
    accessType,
    price,
    featured,
    showOnHome,
    status,
  } = req.body;

  if (
    !title ||
    !description ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const exists = await Course.findOne({
    slug,
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Course already exists.",
    });
  }

  let thumbnail = {
    url: "",
    public_id: "",
  };
  // Upload Thumbnail

  if (req.file) {

    const result = await uploadToCloudinary(
      req.file.buffer,
      "stackadda/courses"
    );

    thumbnail = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const course = await Course.create({
    title,
    slug,
    description,
    thumbnail,
    category,
    level,
    language,
    instructor,
    duration,
    accessType,
    price:
      accessType === "paid"
        ? Number(price)
        : 0,

    featured,
    showOnHome,
    status,

    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully.",
    course,
  });

});

// ==========================
// Get All Courses (Admin)
// ==========================

const getAllCourses = asyncHandler(async (req, res) => {

  const courses = await Course.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });

});

// ==========================
// Get Home Courses
// ==========================

const getHomeCourses = asyncHandler(async (req, res) => {

  const courses = await Course.find({
    showOnHome: true,
    status: "published",
  })
    .select(
      "-students -chapters"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });

});

// ==========================
// Get Published Courses
// ==========================

const getPublishedCourses =
  asyncHandler(async (req, res) => {

    const courses =
      await Course.find({
        status: "published",
      })
        .select("-students")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });

  });
// ==========================
// Get Single Course
// ==========================

const getSingleCourse = asyncHandler(async (req, res) => {

  const course = await Course.findOne({
    slug: req.params.slug,
    status: "published",
  })
    .populate("createdBy", "name");

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const publicCourse = course.toObject();
  publicCourse.chapters = publicCourse.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      video: lesson.isPreview ? lesson.video : { url: "", public_id: "" },
      resources: lesson.isPreview ? lesson.resources : [],
    })),
  }));

  res.status(200).json({
    success: true,
    course: publicCourse,
  });

});

// ==========================
// Add Chapter
// ==========================

const addChapter = asyncHandler(async (req, res) => {

  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Chapter title is required.",
    });
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  course.chapters.push({
    title,
    description,
    order: course.chapters.length + 1,
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: "Chapter added successfully.",
    chapters: course.chapters,
  });

});


// ==========================
// Update Chapter
// ==========================

const updateChapter = asyncHandler(async (req, res) => {

  const { title, description } = req.body;

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const chapter = course.chapters.id(
    req.params.chapterId
  );

  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found.",
    });
  }

  if (title) {
    chapter.title = title;
  }

  if (description !== undefined) {
    chapter.description = description;
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Chapter updated successfully.",
    chapter,
  });

});

// ==========================
// Delete Chapter
// ==========================

const deleteChapter = asyncHandler(async (req, res) => {

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const chapter = course.chapters.id(
    req.params.chapterId
  );

  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found.",
    });
  }

  chapter.deleteOne();

  await course.save();

  res.status(200).json({
    success: true,
    message: "Chapter deleted successfully.",
  });

});

// ==========================
// Add Lesson
// ==========================

const addLesson = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    duration,
    isPreview,
    videoUrl,
  } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Lesson title is required." });
  }

  if (req.file && videoUrl) {
    return res.status(400).json({ success: false, message: "Upload a video file or provide a video URL, not both." });
  }

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const chapter = course.chapters.id(
    req.params.chapterId
  );

  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found.",
    });
  }

  let video = {
    url: "",
    public_id: "",
  };

  if (videoUrl) {
    if (!validator.isURL(videoUrl, { protocols: ["http", "https"], require_protocol: true })) {
      return res.status(400).json({ success: false, message: "Please provide a valid video URL." });
    }
    video = { url: videoUrl, public_id: "" };
  } else if (req.file) {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "stackadda/lessons",
      "video"
    );

    video = {
      url: result.secure_url,
      public_id: result.public_id,
    };

  }

  chapter.lessons.push({
    title,
    description,
    duration,
    isPreview,
    video,
    order:
      chapter.lessons.length + 1,
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: "Lesson added successfully.",
    lessons: chapter.lessons,
  });

});

// ==========================
// Update Lesson
// ==========================

const updateLesson = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    duration,
    isPreview,
    videoUrl,
  } = req.body;

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const chapter = course.chapters.id(
    req.params.chapterId
  );

  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found.",
    });
  }

  const lesson = chapter.lessons.id(
    req.params.lessonId
  );

  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: "Lesson not found.",
    });
  }

  if (title) lesson.title = title;

  if (description !== undefined)
    lesson.description = description;

  if (duration !== undefined)
    lesson.duration = duration;

  if (isPreview !== undefined)
    lesson.isPreview = isPreview;

  if (req.file && videoUrl) {
    return res.status(400).json({ success: false, message: "Upload a video file or provide a video URL, not both." });
  }

  if (videoUrl !== undefined) {
    if (videoUrl && !validator.isURL(videoUrl, { protocols: ["http", "https"], require_protocol: true })) {
      return res.status(400).json({ success: false, message: "Please provide a valid video URL." });
    }
    if (lesson.video.public_id) {
      await cloudinary.uploader.destroy(lesson.video.public_id, { resource_type: "video" });
    }
    lesson.video = { url: videoUrl || "", public_id: "" };
  } else if (req.file) {

    if (lesson.video.public_id) {

      await cloudinary.uploader.destroy(
        lesson.video.public_id,
        {
          resource_type: "video",
        }
      );

    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "stackadda/lessons",
      "video"
    );

    lesson.video = {
      url: result.secure_url,
      public_id: result.public_id,
    };

  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lesson updated successfully.",
    lesson,
  });

});

// ==========================
// Delete Lesson
// ==========================

const deleteLesson = asyncHandler(async (req, res) => {

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const chapter = course.chapters.id(
    req.params.chapterId
  );

  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found.",
    });
  }

  const lesson = chapter.lessons.id(
    req.params.lessonId
  );

  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: "Lesson not found.",
    });
  }

  // Delete Video From Cloudinary

  if (lesson.video.public_id) {

    await cloudinary.uploader.destroy(
      lesson.video.public_id,
      {
        resource_type: "video",
      }
    );

  }

  lesson.deleteOne();

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lesson deleted successfully.",
  });

});

// ==========================
// Update Course
// ==========================

const updateCourse = asyncHandler(async (req, res) => {

  const course = await Course.findById(
    req.params.id
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  const {
    title,
    description,
    category,
    level,
    language,
    instructor,
    duration,
    accessType,
    price,
    featured,
    showOnHome,
    status,
  } = req.body;

  if (title) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const existingCourse = await Course.findOne({
      slug,
      _id: { $ne: course._id },
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Another course already uses this title.",
      });
    }

    course.title = title;
    course.slug = slug;

  }

  if (description !== undefined)
    course.description = description;

  if (category !== undefined)
    course.category = category;

  if (level !== undefined)
    course.level = level;

  if (language !== undefined)
    course.language = language;

  if (instructor !== undefined)
    course.instructor = instructor;

  if (duration !== undefined)
    course.duration = duration;

  const effectiveAccessType = accessType ?? course.accessType;

  if (accessType !== undefined)
    course.accessType = accessType;

  if (price !== undefined)
    course.price =
      effectiveAccessType === "paid"
        ? Number(price)
        : 0;
  else if (effectiveAccessType !== "paid")
    course.price = 0;

  if (featured !== undefined)
    course.featured = featured;

  if (showOnHome !== undefined)
    course.showOnHome = showOnHome;

  if (status !== undefined)
    course.status = status;

  // Thumbnail Update

  if (req.file) {

    if (course.thumbnail.public_id) {

      await cloudinary.uploader.destroy(
        course.thumbnail.public_id
      );

    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "stackadda/courses"
    );

    course.thumbnail = {
      url: result.secure_url,
      public_id: result.public_id,
    };

  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course updated successfully.",
    course,
  });

});

// ==========================
// Delete Course
// ==========================

const deleteCourse = asyncHandler(async (req, res) => {

  const course = await Course.findById(
    req.params.id
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  // Delete Thumbnail

  if (course.thumbnail.public_id) {

    await cloudinary.uploader.destroy(
      course.thumbnail.public_id
    );

  }

  // Delete All Lesson Videos

  for (const chapter of course.chapters) {

    for (const lesson of chapter.lessons) {

      if (lesson.video.public_id) {

        await cloudinary.uploader.destroy(
          lesson.video.public_id,
          {
            resource_type: "video",
          }
        );

      }

    }

  }

  // Remove Course From All Students

  await User.updateMany(
    {
      enrolledCourses: course._id,
    },
    {
      $pull: {
        enrolledCourses: course._id,
      },
    }
  );

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully.",
  });

});

// ==========================
// Assign Course To Student
// ==========================

const assignCourse = asyncHandler(async (req, res) => {

  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Student and Course are required.",
    });
  }

  const student = await User.findById(studentId);

  if (!student || student.role !== "student") {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  // Already Assigned

  if (student.enrolledCourses.includes(course._id)) {
    return res.status(400).json({
      success: false,
      message: "Course already assigned.",
    });
  }

  student.enrolledCourses.push(course._id);

  course.students.push(student._id);

  await student.save();

  await course.save();

  await sendEmail({
    to: student.email,
    subject: `New course assigned: ${course.title}`,
    html: `<h2>You've been enrolled!</h2><p>${course.title} was assigned to your Stack Adda account. Log in to start learning.</p>`,
  });

  res.status(200).json({
    success: true,
    message: "Course assigned successfully.",
  });

});

// ==========================
// Remove Assigned Course
// ==========================

const removeAssignedCourse = asyncHandler(async (req, res) => {

  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Student and Course are required.",
    });
  }

  const student = await User.findById(studentId);

  if (!student || student.role !== "student") {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  student.enrolledCourses.pull(course._id);

  course.students.pull(student._id);

  await student.save();

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course removed successfully.",
  });

});

// ==========================
// Free Enroll Course
// ==========================

const enrollFreeCourse = asyncHandler(async (req, res) => {

  const student = await User.findById(req.user._id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(
    req.params.courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.accessType !== "free") {
    return res.status(400).json({
      success: false,
      message: "This is a paid course.",
    });
  }

  if (
    student.enrolledCourses.includes(course._id)
  ) {
    return res.status(400).json({
      success: false,
      message: "Already enrolled.",
    });
  }

  student.enrolledCourses.push(course._id);

  course.students.push(student._id);

  await student.save();

  await course.save();

  await sendEmail({
    to: student.email,
    subject: `Enrollment confirmed: ${course.title}`,
    html: `<h2>You're enrolled in ${course.title}</h2><p>Your free course access is ready. Open My Courses and start learning.</p>`,
  });

  res.status(200).json({
    success: true,
    message: "Enrolled successfully.",
  });

});

// ==========================
// Get My Courses
// ==========================

const getMyCourses = asyncHandler(async (req, res) => {

  const student = await User.findById(req.user._id)
    .populate({
      path: "enrolledCourses",
      match: {
        status: "published",
      },
    });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  res.status(200).json({
    success: true,
    count: student.enrolledCourses.length,
    courses: student.enrolledCourses,
  });

});

// ==========================
// Add / Delete Lesson Resource
// ==========================
const addLessonResource = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ success: false, message: "Course not found." });
  const chapter = course.chapters.id(req.params.chapterId);
  const lesson = chapter?.lessons.id(req.params.lessonId);
  if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found." });
  if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });
  if (!title) return res.status(400).json({ success: false, message: "Resource title is required." });
  if (req.file) return res.status(400).json({ success: false, message: "Resource uploads are disabled. Add a link instead." });
  if (!url || !validator.isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
    return res.status(400).json({ success: false, message: "Add a valid resource link." });
  }
  let resourceUrl = url;
  let publicId = "";
  let filePath = "";
  let type = "link";
  let fileName = "";
  let mimeType = "";
  let size = 0;
  fileName = buildDownloadFileName({ title, url });

  const resource = lesson.resources.create({
    title,
    url: resourceUrl,
    public_id: publicId,
    filePath,
    type,
    fileName,
    mimeType,
    size,
  });
  lesson.resources.push(resource);

  if (type === "file") {
    resource.url = `/api/course/course/${course._id}/chapter/${chapter._id}/lesson/${lesson._id}/resource/${resource._id}/download`;
  }

  await course.save();
  res.status(201).json({ success: true, message: "Resource added successfully.", resources: lesson.resources });
});

const deleteLessonResource = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ success: false, message: "Course not found." });
  const lesson = course.chapters.id(req.params.chapterId)?.lessons.id(req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });
  const resource = lesson?.resources.id(req.params.resourceId);
  if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });
  if (resource.filePath) {
    await fs.promises.unlink(resource.filePath).catch(() => { });
  }
  if (resource.public_id) await cloudinary.uploader.destroy(resource.public_id, { resource_type: "raw" });
  resource.deleteOne();
  await course.save();
  res.status(200).json({ success: true, message: "Resource deleted successfully." });
});

const downloadLessonResource = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId).select(
    "title students chapters"
  );

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found." });
  }

  const isAdmin = req.user.role === "admin";
  const isEnrolled = course.students.some((studentId) =>
    studentId.equals(req.user._id)
  );

  if (!isAdmin && !isEnrolled) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to download this resource.",
    });
  }

  const lesson = course.chapters
    .id(req.params.chapterId)
    ?.lessons.id(req.params.lessonId);
  const resource = lesson?.resources.id(req.params.resourceId);

  if (!resource) {
    return res.status(404).json({ success: false, message: "Resource not found." });
  }

  const fileName = buildDownloadFileName({
    title: resource.title,
    fileName: resource.fileName,
    mimeType: resource.mimeType || resource.type,
    url: resource.url,
  });

  if (resource.type === "file") {
    if (resource.filePath) {
      const exists = await fs.promises
        .access(resource.filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Resource file not found.",
        });
      }

      return res.download(resource.filePath, fileName, (error) => {
        if (error && !res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Could not download the resource file.",
          });
        }
      });
    }

    if (resource.url && validator.isURL(resource.url, { protocols: ["http", "https"], require_protocol: true })) {
      return res.redirect(302, resource.url);
    }

    return res.status(404).json({
      success: false,
      message: "Resource file not found.",
    });
  }

  if (!resource.url || !validator.isURL(resource.url, { protocols: ["http", "https"], require_protocol: true })) {
    return res.status(400).json({
      success: false,
      message: "Resource link is invalid.",
    });
  }

  return res.redirect(302, resource.url);
});

// ==========================
// Get Enrolled Course (Student)
// ==========================
const getEnrolledCourse = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id).select("enrolledCourses");
  const course = await Course.findOne({ _id: req.params.id, status: "published" });

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found." });
  }

  const isAdmin = req.user.role === "admin";
  if (!isAdmin && !student.enrolledCourses.some((courseId) => courseId.equals(course._id))) {
    return res.status(403).json({ success: false, message: "You are not enrolled in this course." });
  }

  res.status(200).json({ success: true, course });
});
// ==========================
// Get Course By ID
// ==========================

const getCourseById = asyncHandler(async (req, res) => {

  const course = await Course.findById(req.params.id)
    .populate("students", "name email profileImage");

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  res.status(200).json({
    success: true,
    course,
  });

});

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,

  getAllCourses,
  getHomeCourses,
  getPublishedCourses,
  getSingleCourse,
  addChapter,
  updateChapter,
  deleteChapter,
  addLesson,
  updateLesson,
  deleteLesson,
  addLessonResource,
  deleteLessonResource,
  downloadLessonResource,
  assignCourse,
  removeAssignedCourse,
  enrollFreeCourse,
  getMyCourses,
  getEnrolledCourse,

};

