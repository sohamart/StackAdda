const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  createOrder,
  verifyPayment,
  paymentHistory,
  refundPayment,
} = require("../Controllers/paymentController");

// ==========================
// Create UPI Payment Request
// ==========================

router.post(
  "/create-order",
  authMiddleware,
  roleMiddleware("student"),
  createOrder
);

// ==========================
// Verify Payment
// ==========================

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("student"),
  verifyPayment
);

// ==========================
// Payment History
// ==========================

router.get(
  "/history",
  authMiddleware,
  roleMiddleware("student"),
  paymentHistory
);

// ==========================
// Refund Payment (Admin)
// ==========================

router.post(
  "/refund/:paymentId",
  authMiddleware,
  roleMiddleware("admin"),
  refundPayment
);

module.exports = router;
