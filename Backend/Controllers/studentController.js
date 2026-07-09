const asyncHandler = require("express-async-handler");

// Student Dashboard
const dashboard = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome ${req.user.name}`,
    student: req.user,
  });
});

module.exports = {
  dashboard,
};