const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { createBooking,getMyBookings,getBookingById,cancelBooking} = require("../controllers/bookingController");

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.get("/:id", authMiddleware, getBookingById);
router.patch("/:id/cancel",authMiddleware,cancelBooking);

module.exports = router;
