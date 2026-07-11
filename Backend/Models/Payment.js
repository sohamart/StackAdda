const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "razorpay",
        "manual",
        "free",
      ],
      default: "manual",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    upiReferenceId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  PaymentSchema
);