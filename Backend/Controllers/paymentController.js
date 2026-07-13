const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Course = require("../Models/Course");
const User = require("../Models/User");
const Order = require("../Models/Order");
const Payment = require("../Models/Payment");
const Coupon = require("../Models/Coupon");
const sendEmail = require("../Utils/sendEmail");
const { getEnrollmentEmail, getRefundEmail } = require("../Utils/emailTemplates");
const generateInvoice = require("../Utils/generateInvoice");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================
// Create Razorpay Payment Order
// ==========================

const createOrder = asyncHandler(async (req, res) => {
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

  // If price is 0 (due to coupon or free access), complete enrollment immediately!
  if (finalPrice === 0) {
    const payment = await Payment.create({
      student: student._id,
      course: course._id,
      amount: 0,
      paymentMethod: "free",
      status: "success",
      paidAt: new Date(),
    });

    const order = await Order.create({
      student: student._id,
      course: course._id,
      payment: payment._id,
      coupon: coupon ? coupon._id : null,
      originalPrice,
      discount,
      finalPrice: 0,
      paymentStatus: "paid",
      orderStatus: "completed",
      purchasedAt: new Date(),
    });

    if (!student.enrolledCourses.some((id) => id.equals(course._id))) {
      student.enrolledCourses.push(course._id);
    }
    if (!course.students.some((id) => id.equals(student._id))) {
      course.students.push(student._id);
    }
    await student.save();
    await course.save();

    if (coupon) {
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    const invoicePdf = await generateInvoice({
      invoiceId: order._id.toString().slice(-8).toUpperCase(),
      date: new Date(),
      customerName: student.name,
      customerEmail: student.email,
      courseTitle: course.title,
      amount: 0,
    });

    await sendEmail({
      to: student.email,
      subject: "Course Enrollment Confirmation",
      html: getEnrollmentEmail(student.name, course.title, course._id),
      attachments: [{ filename: `Invoice_${order._id}.pdf`, content: invoicePdf }],
    });

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully.",
      isFree: true,
      courseId: course._id,
    });
  }

  // Create Razorpay Order
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Razorpay keys are not configured.",
    });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(finalPrice * 100), // Razorpay expects amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  });

  const payment = await Payment.create({
    student: student._id,
    course: course._id,
    amount: finalPrice,
    paymentMethod: "razorpay",
    razorpayOrderId: razorpayOrder.id,
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
    key: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: razorpayOrder.id,
    paymentId: payment._id,
    amount: finalPrice,
    currency: "INR",
    order,
  });
});

// ==========================
// Verify Razorpay Payment Signature
// ==========================

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  if (!paymentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed. Missing required parameters.",
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

  // Verify Signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed. Signature mismatch.",
    });
  }

  // Update payment and order documents
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
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

  if (!student.enrolledCourses.some((id) => id.equals(course._id))) {
    student.enrolledCourses.push(course._id);
  }

  if (!course.students.some((id) => id.equals(student._id))) {
    course.students.push(student._id);
  }

  await student.save();
  await course.save();

  const invoicePdf = await generateInvoice({
    invoiceId: order._id.toString().slice(-8).toUpperCase(),
    date: new Date(),
    customerName: student.name,
    customerEmail: student.email,
    courseTitle: course.title,
    amount: payment.amount,
  });

  await sendEmail({
    to: student.email,
    subject: "Course Enrollment Confirmation",
    html: getEnrollmentEmail(student.name, course.title, course._id),
    attachments: [{ filename: `Invoice_${order._id}.pdf`, content: invoicePdf }],
  });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully. Enrolled in course.",
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
    html: getRefundEmail(course.title),
  });

  res.status(200).json({
    success: true,
    message: "Payment refunded successfully.",
  });

});

// ==========================
// Download Invoice
// ==========================

const downloadInvoice = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId).populate("student").populate("course").populate("payment");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found." });
  }

  // Allow admin OR the student who made the order
  if (req.user.role !== "admin" && order.student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }

  if (order.paymentStatus !== "paid") {
    return res.status(400).json({ success: false, message: "Invoice not available for unpaid orders." });
  }

  const invoicePdf = await generateInvoice({
    invoiceId: order._id.toString().slice(-8).toUpperCase(),
    date: order.purchasedAt || order.createdAt,
    customerName: order.student.name,
    customerEmail: order.student.email,
    courseTitle: order.course.title,
    amount: order.finalPrice,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Invoice_${order._id}.pdf`);
  res.send(invoicePdf);
});


module.exports = {
  createOrder,
  verifyPayment,
  paymentHistory,
  refundPayment,
  downloadInvoice,
};
