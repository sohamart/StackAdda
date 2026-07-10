const asyncHandler = require("express-async-handler");
const User = require("../Models/User");

const dashboard = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id)
    .populate("verifiedBy", "name email profileImage")
    .select("-password");

  res.status(200).json({
    success: true,
    message: `Welcome ${student.name}`,
    student,
  });
});

module.exports = {
  dashboard,
};