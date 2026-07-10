const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Course = require("../Models/Course");
const User = require("../Models/User");

const cloudinary = require("../Config/cloudinary");

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

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "stackadda/courses",
      }
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
  })
    .populate("createdBy", "name email")
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

  let video = {
    url: "",
    public_id: "",
  };

  if (req.file) {

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "video",
          folder: "stackadda/lessons",
        }
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

  if (req.file) {

    if (lesson.video.public_id) {

      await cloudinary.uploader.destroy(
        lesson.video.public_id,
        {
          resource_type: "video",
        }
      );

    }

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "video",
          folder: "stackadda/lessons",
        }
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

    course.title = title;

    course.slug = slugify(title, {
      lower: true,
      strict: true,
    });

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

  if (accessType !== undefined)
    course.accessType = accessType;

  if (price !== undefined)
    course.price =
      accessType === "paid"
        ? Number(price)
        : 0;

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

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "stackadda/courses",
        }
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

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
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
    assignCourse,
    removeAssignedCourse,
    enrollFreeCourse,
    getMyCourses,
};

