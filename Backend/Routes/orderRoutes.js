const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  getMyOrders,
  getAllOrders,
  cancelOrder,
} = require("../Controllers/orderController");

// Student

router.get(
  "/my-orders",
  authMiddleware,
  roleMiddleware("student"),
  getMyOrders
);

// Cancel Order

router.put(
  "/cancel/:orderId",
  authMiddleware,
  roleMiddleware("student"),
  cancelOrder
);

// Admin

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

module.exports = router;
