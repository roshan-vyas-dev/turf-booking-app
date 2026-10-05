const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/:id/order", authMiddleware, createPaymentOrder);

router.post("/:id/verify", authMiddleware, verifyPayment);

module.exports = router;