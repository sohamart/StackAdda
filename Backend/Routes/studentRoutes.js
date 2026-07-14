const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const { dashboard, reportPiracy } = require("../Controllers/studentController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("student"),
  dashboard
);

router.post(
  "/report-piracy",
  authMiddleware,
  roleMiddleware("student"),
  reportPiracy
);

module.exports = router;