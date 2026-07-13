const asyncHandler = require("express-async-handler");

const Coupon = require("../Models/Coupon");

// ==========================
// Create Coupon
// ==========================

const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumAmount,
    maxDiscount,
    usageLimit,
    validFrom,
    validTill,
    applicableCourses,
  } = req.body;

  if (!code || !discountValue || !validTill) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  const exists = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Coupon already exists.",
    });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumAmount,
    maxDiscount,
    usageLimit,
    validFrom,
    validTill,
    applicableCourses,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully.",
    coupon,
  });
});

// ==========================
// Get Coupons
// ==========================

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
    .populate("applicableCourses", "title")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: coupons.length,
    coupons,
  });
});

// ==========================
// Validate Coupon
// ==========================

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId } = req.body;

  if (!code || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Coupon code and course are required.",
    });
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Invalid coupon code.",
    });
  }

  if (coupon.validTill < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Coupon expired.",
    });
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({
      success: false,
      message: "Coupon usage limit exceeded.",
    });
  }

  if (
    coupon.applicableCourses.length > 0 &&
    !coupon.applicableCourses.some((id) => id.equals(courseId))
  ) {
    return res.status(400).json({
      success: false,
      message: "Coupon is not applicable for this course.",
    });
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// ==========================
// Update Coupon
// ==========================

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found.",
    });
  }

  Object.assign(coupon, req.body);

  if (req.body.code) {
    coupon.code = req.body.code.toUpperCase();
  }

  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully.",
    coupon,
  });
});

// ==========================
// Delete Coupon
// ==========================

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found.",
    });
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully.",
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
};
