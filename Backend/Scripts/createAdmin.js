require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../Models/User");
const connectDB = require("../Config/db");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({
      email: "admin@stackadda.com",
    });

    if (adminExists) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Stack Adda Admin",
      email: "admin@stackadda.com",
      password: "Admin@123",
      role: "admin",
    });

    console.log("🎉 Admin created successfully");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

createAdmin();