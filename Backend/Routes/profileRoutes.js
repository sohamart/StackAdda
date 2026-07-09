const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Config/multer");

const {
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
} = require("../Controllers/profileController");

router.put(
  "/image",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage
);
router.put(
  "/password",
  authMiddleware,
  changePassword
);
router.put(
  "/",
  authMiddleware,
  updateProfile
);
router.get(
  "/get",
  authMiddleware,
  getProfile
);


module.exports = router;