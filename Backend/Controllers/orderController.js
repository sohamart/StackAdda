const asyncHandler = require("express-async-handler");

const Order = require("../Models/Order");


// ==========================
// Get My Orders
// ==========================

const getMyOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find({
    student: req.user._id,
  })
    .populate(
      "course",
      "title thumbnail accessType"
    )
    .populate(
      "coupon",
      "code discountType discountValue"
    )
    .populate(
      "payment"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });

});

// ==========================
// Get All Orders
// ==========================

const getAllOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find()
    .populate(
      "student",
      "name email"
    )
    .populate(
      "course",
      "title thumbnail"
    )
    .populate(
      "coupon",
      "code"
    )
    .populate(
      "payment"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });

});

// ==========================
// Cancel Order
// ==========================

const cancelOrder = asyncHandler(async (req, res) => {

  const order = await Order.findById(
    req.params.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  if (
    order.student.toString() !==
    req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message:
        "Paid order cannot be cancelled.",
    });
  }

  order.orderStatus = "cancelled";

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully.",
  });

});

module.exports = {
  getMyOrders,
  getAllOrders,
  cancelOrder,
};