const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const {
  createCoupon,
  getCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../Controllers/couponController");

// ==========================
// Student
// ==========================

// Validate Coupon

router.post(
  "/validate",
  authMiddleware,
  validateCoupon
);

// ==========================
// Admin
// ==========================

// Create Coupon

router.post(
  "/",
  authMiddleware,
  createCoupon
);

// Get All Coupons

router.get(
  "/",
  authMiddleware,
  getCoupons
);

// Update Coupon

router.put(
  "/:id",
  authMiddleware,
  updateCoupon
);

// Delete Coupon

router.delete(
  "/:id",
  authMiddleware,
  deleteCoupon
);

module.exports = router;