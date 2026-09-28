const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { createBooking,getMyBookings,getBookingById,cancelBooking,getAllBookings} = require("../controllers/bookingController");

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.get("/:id", authMiddleware, getBookingById);
router.patch("/:id/cancel",authMiddleware,cancelBooking);
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;
