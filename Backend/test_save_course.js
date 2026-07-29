require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./Config/db");
const Course = require("./Models/Course");

const run = async () => {
  await connectDB();
  try {
    const course = await Course.create({
      title: "Test Course",
      slug: "test-course-" + Date.now(),
      description: "",
      category: "General",
      accessType: "free",
      price: 0,
      status: "published",
      thumbnail: { url: "", public_id: "" },
      chapters: [
        {
          title: "Chapter 1",
          lessons: [
            {
              title: "Lesson 1",
              type: "video",
              video: { url: "test.com" }
            }
          ]
        }
      ],
      createdBy: new mongoose.Types.ObjectId(),
    });
    console.log("Success:", course._id);
  } catch (err) {
    console.log("Error:", err.message);
  }
  process.exit();
};
run();
