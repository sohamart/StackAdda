const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const {
  createOrder,
  verifyPayment,
  paymentHistory,
  refundPayment,
} = require("../Controllers/paymentController");

// ==========================
// Create Razorpay Order
// ==========================

router.post(
  "/create-order",
  authMiddleware,
  createOrder
);

// ==========================
// Verify Payment
// ==========================

router.post(
  "/verify",
  authMiddleware,
  verifyPayment
);

// ==========================
// Payment History
// ==========================

router.get(
  "/history",
  authMiddleware,
  paymentHistory
);

// ==========================
// Refund Payment (Admin)
// ==========================

router.post(
  "/refund/:paymentId",
  authMiddleware,
  refundPayment
);

module.exports = router;