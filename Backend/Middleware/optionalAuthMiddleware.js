const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid or expired, just proceed without user info
    next();
  }
};

module.exports = optionalAuthMiddleware;
