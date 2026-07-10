const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

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
  roleMiddleware("student"),
  validateCoupon
);

// ==========================
// Admin
// ==========================

// Create Coupon

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCoupon
);

// Get All Coupons

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getCoupons
);

// Update Coupon

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCoupon
);

// Delete Coupon

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCoupon
);

module.exports = router;
