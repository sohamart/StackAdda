const express = require("express");
const router = express.Router();

const {
  createLiveClass,
  getCourseLiveClasses,
  getActiveLiveClasses,
  getLiveClass,
  updateLiveClass,
  deleteLiveClass,
  changeClassStatus,
  startStream,
  logAttendance,
} = require("../Controllers/liveClassController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");
const upload = require("../Config/multer");

// Admin routes
router.post("/admin", authMiddleware, roleMiddleware("admin"), upload.single("introVideo"), createLiveClass);
router.get("/admin/course/:courseId", authMiddleware, roleMiddleware("admin"), getCourseLiveClasses);
router.put("/admin/:id", authMiddleware, roleMiddleware("admin"), updateLiveClass);
router.delete("/admin/:id", authMiddleware, roleMiddleware("admin"), deleteLiveClass);
router.patch("/admin/:id/status", authMiddleware, roleMiddleware("admin"), changeClassStatus);
router.patch("/admin/:id/start-stream", authMiddleware, roleMiddleware("admin"), startStream);

// Student/Common routes
router.get("/course/:courseId", authMiddleware, getActiveLiveClasses);
router.get("/:id", authMiddleware, getLiveClass);
router.post("/:id/attendance", authMiddleware, logAttendance);

module.exports = router;
