const asyncHandler = require("express-async-handler");

const Course = require("../Models/Course");
const User = require("../Models/User");
const Order = require("../Models/Order");
const Payment = require("../Models/Payment");
const Coupon = require("../Models/Coupon");
const sendEmail = require("../Utils/sendEmail");

const getUpiConfig = () => {
  const upiId = process.env.UPI_ID;
  const payeeName = process.env.UPI_NAME || "Stack Adda";

  if (!upiId) {
    return null;
  }

  return { upiId, payeeName };
};

const buildUpiIntentUrl = ({ upiId, payeeName, amount, note }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
};

// ==========================
// Create UPI Payment Request
// ==========================

const createOrder = asyncHandler(async (req, res) => {
  const upiConfig = getUpiConfig();

  if (!upiConfig) {
    return res.status(500).json({
      success: false,
      message: "UPI payment is not configured.",
    });
  }

  const { courseId, couponCode } = req.body;

  const student = await User.findById(req.user._id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  const course = await Course.findById(courseId);

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

  if (student.enrolledCourses.some((id) => id.equals(course._id))) {
    return res.status(400).json({
      success: false,
      message: "Already enrolled.",
    });
  }

  const originalPrice = course.price;
  let discount = 0;
  let coupon = null;

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

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded.",
      });
    }

    if (coupon.minimumAmount > originalPrice) {
      return res.status(400).json({
        success: false,
        message: "Minimum purchase amount not reached.",
      });
    }

    if (
      coupon.applicableCourses.length > 0 &&
      !coupon.applicableCourses.some((id) => id.equals(course._id))
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not applicable for this course.",
      });
    }

    if (coupon.discountType === "percentage") {
      discount = (originalPrice * coupon.discountValue) / 100;

      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
  }

  const finalPrice = Math.max(originalPrice - discount, 0);
  const note = `Stack Adda payment for ${course.title}`;
  const intentUrl = buildUpiIntentUrl({
    upiId: upiConfig.upiId,
    payeeName: upiConfig.payeeName,
    amount: finalPrice,
    note,
  });

  const payment = await Payment.create({
    student: student._id,
    course: course._id,
    amount: finalPrice,
    paymentMethod: "manual",
    status: "pending",
  });

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
    paymentId: payment._id,
    amount: finalPrice,
    currency: "INR",
    upi: {
      payeeVpa: upiConfig.upiId,
      payeeName: upiConfig.payeeName,
      note,
      intentUrl,
    },
    order,
  });
});

// ==========================
// Confirm Manual Payment
// ==========================

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, transactionId } = req.body;

  if (!paymentId || !transactionId) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed.",
    });
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found.",
    });
  }

  if (payment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot verify another user's payment.",
    });
  }

  if (payment.status === "success") {
    return res.status(200).json({
      success: true,
      message: "Payment was already verified.",
      courseId: payment.course,
    });
  }

  const order = await Order.findOne({ payment: payment._id });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  const student = await User.findById(payment.student);
  const course = await Course.findById(payment.course);

  if (!student || !course) {
    return res.status(404).json({
      success: false,
      message: "Student or Course not found.",
    });
  }

  if (!student.enrolledCourses.some((id) => id.equals(course._id))) {
    student.enrolledCourses.push(course._id);
  }

  if (!course.students.some((id) => id.equals(student._id))) {
    course.students.push(student._id);
  }

  payment.upiReferenceId = transactionId.trim();
  payment.status = "success";
  payment.paidAt = new Date();

  await payment.save();

  order.paymentStatus = "paid";
  order.orderStatus = "completed";
  order.purchasedAt = new Date();

  await order.save();

  if (order.coupon) {
    await Coupon.findByIdAndUpdate(order.coupon, {
      $inc: {
        usedCount: 1,
      },
    });
  }

  await student.save();
  await course.save();

  await sendEmail({
    to: student.email,
    subject: `Payment confirmed: ${course.title}`,
    html: `<h2>Payment successful</h2><p>We received your UPI payment of ₹${payment.amount} for <strong>${course.title}</strong>. Your course access is now active.</p>`,
  });

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

  await sendEmail({
    to: student.email,
    subject: `Refund processed: ${course.title}`,
    html: `<h2>Refund processed</h2><p>Your refund for <strong>${course.title}</strong> has been processed. Course access has been removed.</p>`,
  });

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
