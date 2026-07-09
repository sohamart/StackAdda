const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const { dashboard } = require("../Controllers/studentController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("student"),
  dashboard
);

module.exports = router;