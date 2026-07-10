const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Course = require("../Models/Course");
const User = require("../Models/User");
const Order = require("../Models/Order");
const Payment = require("../Models/Payment");
const Coupon = require("../Models/Coupon");

let razorpay = null;

if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}



// ==========================
// Create Razorpay Order
// ==========================

const createOrder = asyncHandler(async (req, res) => {
    if (!razorpay) {
  return res.status(500).json({
    success: false,
    message: "Payment gateway is not configured.",
  });
}
  const {
    courseId,
    couponCode,
  } = req.body;

  const student = await User.findById(
    req.user._id
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(
    courseId
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.accessType !== "paid") {
    return res.status(400).json({
      success: false,
      message: "This is not a paid course.",
    });
  }

  if (
    student.enrolledCourses.some(id =>
      id.equals(course._id)
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Already enrolled.",
    });
  }

  let originalPrice = course.price;

  let discount = 0;

  let coupon = null;
    // ==========================
  // Apply Coupon
  // ==========================

  if (couponCode) {

    coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
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
        message: "Coupon has expired.",
      });
    }

    if (
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded.",
      });
    }

    if (
      coupon.minimumAmount > originalPrice
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum purchase amount not reached.",
      });
    }

    if (
      coupon.applicableCourses.length > 0 &&
      !coupon.applicableCourses.some((id) =>
        id.equals(course._id)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon is not applicable for this course.",
      });
    }

    if (
      coupon.discountType === "percentage"
    ) {

      discount =
        (originalPrice *
          coupon.discountValue) /
        100;

      if (
        coupon.maxDiscount > 0 &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }

    } else {

      discount = coupon.discountValue;

    }

  }

  const finalPrice = Math.max(
    originalPrice - discount,
    0
  );

  const razorpayOrder =
    await razorpay.orders.create({
      amount: finalPrice * 100,
      currency: "INR",
      receipt: `course_${Date.now()}`,
    });

      // ==========================
  // Create Payment
  // ==========================

  const payment = await Payment.create({
    student: student._id,
    course: course._id,
    amount: finalPrice,
    paymentMethod: "razorpay",
    razorpayOrderId: razorpayOrder.id,
    status: "pending",
  });

  // ==========================
  // Create Order
  // ==========================

  const order = await Order.create({
    student: student._id,
    course: course._id,

    payment: payment._id,

    coupon: coupon ? coupon._id : null,

    originalPrice,

    discount,

    finalPrice,

    paymentStatus: "pending",

    orderStatus: "created",
  });

  res.status(200).json({
    success: true,

    orderId: razorpayOrder.id,

    amount: razorpayOrder.amount,

    currency: razorpayOrder.currency,

    key: process.env.RAZORPAY_KEY_ID,

    order,
  });

});

// ==========================
// Verify Payment
// ==========================

const verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed.",
    });
  }

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

  if (
    generatedSignature !==
    razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature.",
    });
  }

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found.",
    });
  }

  const order = await Order.findOne({
    payment: payment._id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  const student = await User.findById(
    payment.student
  );

  const course = await Course.findById(
    payment.course
  );

  if (!student || !course) {
    return res.status(404).json({
      success: false,
      message: "Student or Course not found.",
    });
  }
  // Prevent Duplicate Enrollment

  if (
    !student.enrolledCourses.some((id) =>
      id.equals(course._id)
    )
  ) {
    student.enrolledCourses.push(course._id);
  }

  if (
    !course.students.some((id) =>
      id.equals(student._id)
    )
  ) {
    course.students.push(student._id);
  }

  // Update Payment

  payment.razorpayPaymentId =
    razorpay_payment_id;

  payment.razorpaySignature =
    razorpay_signature;

  payment.status = "success";

  payment.paidAt = new Date();

  await payment.save();

  // Update Order

  order.paymentStatus = "paid";

  order.orderStatus = "completed";

  order.purchasedAt = new Date();

  await order.save();

  // Update Coupon Usage

  if (order.coupon) {

    await Coupon.findByIdAndUpdate(
      order.coupon,
      {
        $inc: {
          usedCount: 1,
        },
      }
    );

  }

  await student.save();

  await course.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully.",
    courseId: course._id,
  });

});

// ==========================
// Payment History
// ==========================

const paymentHistory = asyncHandler(async (req, res) => {

  const payments = await Payment.find({
    student: req.user._id,
  })
    .populate(
      "course",
      "title thumbnail price accessType"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });

});

// ==========================
// Refund Payment (Admin)
// ==========================

const refundPayment = asyncHandler(async (req, res) => {

  const payment = await Payment.findById(
    req.params.paymentId
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found.",
    });
  }

  if (payment.status !== "success") {
    return res.status(400).json({
      success: false,
      message: "Only successful payments can be refunded.",
    });
  }

  const order = await Order.findOne({
    payment: payment._id,
  });

  const student = await User.findById(
    payment.student
  );

  const course = await Course.findById(
    payment.course
  );

  if (!order || !student || !course) {
    return res.status(404).json({
      success: false,
      message: "Related data not found.",
    });
  }

  // Remove Course From Student

  student.enrolledCourses.pull(course._id);

  // Remove Student From Course

  course.students.pull(student._id);

  // Update Payment

  payment.status = "refunded";

  await payment.save();

  // Update Order

  order.paymentStatus = "refunded";

  order.orderStatus = "cancelled";

  await order.save();

  // Decrease Coupon Usage

  if (order.coupon) {

    await Coupon.findByIdAndUpdate(
      order.coupon,
      {
        $inc: {
          usedCount: -1,
        },
      }
    );

  }

  await student.save();

  await course.save();

  res.status(200).json({
    success: true,
    message: "Payment refunded successfully.",
  });

});


module.exports = {
  createOrder,
    verifyPayment,
    paymentHistory,
    refundPayment,
};
