const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");

const createPaymentOrder = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId).populate("turf");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not allowed to do",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Booking is already paid",
      });
    }

    const amount = booking.turf.pricePerHour;
    const amountInPaise = amount * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
    });

    booking.razorpayOrderId = order.id;

    await booking.save();

    return res.status(200).json({
      order,
    });
  } catch (error) {
    console.log("PAYMENT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }

  if (booking.user.toString() !== req.user.userId) {
    return res.status(403).json({
      message: "Not allowed to do",
    });
  }

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
      message: "Payment verification data is required",
    });
  }

  if (razorpay_order_id !== booking.razorpayOrderId) {
    return res.status(400).json({
      message: "Invalid payment order",
    });
  }

  const message =
    razorpay_order_id + "|" + razorpay_payment_id;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(message)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      message: "Invalid payment signature",
    });
  }

  booking.paymentStatus = "paid";
  booking.status = "confirmed";

  await booking.save();

  return res.status(200).json({
    booking,
    message: "Payment verified successfully",
  });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};