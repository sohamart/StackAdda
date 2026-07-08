const bcrypt = require("bcrypt");
const Student = require("../Model/Student");
const Admin = require("../Model/Admin");
const generateToken = require("../Utils/generateToken");


// =======================
// Student Register
// =======================

const studentRegister = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exist = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    const token = generateToken(student._id, student.role);
    

res
  .cookie("token", token, {
     httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(201)
  .json({
    success: true,
    message: "Registration Successful",
    student,
  });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// =======================
// Student Login
// =======================

const studentLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      student.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(student._id, student.role);
    res
  .cookie("token", token, {
    httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    success: true,
    message: "Login Successful",
    student,
  });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// =======================
// Admin Login
// =======================

const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(admin._id, admin.role);
    

res
  .cookie("token", token, {
     httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(200)
  .json({
    success: true,
    message: "Admin Login Successful",
    admin,
  });

    
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =======================
// Admin Register
// =======================

const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exist = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    const token = generateToken(admin._id, admin.role);

    res
      .cookie("token", token, {
         httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "Admin Registered Successfully",
        admin,
      });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Students
// =======================

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================
// Get All Admins
// =======================

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.status(200).json({
      success: true,
      totalAdmins: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Student By ID
// =======================

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================
// Get Admin By ID
// =======================

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Logged In Student
// =======================

const loggedInStudent = async (req, res) => {
  try {

    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =======================
// Logged In Admin
// =======================

const loggedInAdmin = async (req, res) => {
  try {

    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// Logout
// =======================

const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout Successful",
    });
};

module.exports = {
  studentRegister,
  studentLogin,
  adminLogin,
  adminRegister,
  getAllStudents,
    getAllAdmins,
    getStudentById,
    getAdminById,
    loggedInStudent,
    loggedInAdmin,
    logout,
};


