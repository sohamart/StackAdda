const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");

const {
  getMyOrders,
  getAllOrders,
  cancelOrder,
} = require("../Controllers/orderController");

// Student

router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// Cancel Order

router.put(
  "/cancel/:orderId",
  authMiddleware,
  cancelOrder
);

// Admin

router.get(
  "/all",
  authMiddleware,
  getAllOrders
);

module.exports = router;