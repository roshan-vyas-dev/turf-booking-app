const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

const createBooking = async (req, res) => {
  try {
    const { turf, bookingDate, startTime, endTime } = req.body;

    if (!turf || !bookingDate || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "All booking fields are required" });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(bookingDate)) {
      return res.status(400).json({
        message: "Invalid booking date format. Use YYYY-MM-DD",
      });
    }

    const startTimePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    const endTimePattern = /^(([01]\d|2[0-3]):[0-5]\d|24:00)$/;

    if (!startTimePattern.test(startTime) || !endTimePattern.test(endTime)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:mm",
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const istDateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const todayIST = `${istDateParts.find((part) => part.type === "year").value}-${istDateParts.find((part) => part.type === "month").value}-${istDateParts.find((part) => part.type === "day").value}`;

    const [year, month, day] = bookingDate.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
      return res.status(400).json({
        message: "Invalid calendar date",
      });
    }

    if (bookingDate < todayIST) {
      return res
        .status(400)
        .json({ message: "Booking date cannot be in the past" });
    }

    const istTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const currentHour = Number(
      istTime.find((part) => part.type === "hour").value,
    );

    const currentMinute = Number(
      istTime.find((part) => part.type === "minute").value,
    );

    const [slotHour, slotMinute] = startTime.split(":");

    const bookingHour = Number(slotHour);
    const bookingMinute = Number(slotMinute);

    if (bookingDate === todayIST) {
      if (bookingHour < currentHour) {
        return res
          .status(400)
          .json({ message: "This time slot has already passed" });
      }

      if (bookingHour === currentHour && bookingMinute <= currentMinute) {
        return res
          .status(400)
          .json({ message: "This time slot has already passed" });
      }
    }

    const normalizedBookingDate = new Date(`${bookingDate}T00:00:00.000Z`);

    const user = req.user.userId;

    const selectedTurf = await Turf.findById(turf);

    if (!selectedTurf) {
      return res.status(404).json({ message: "Turf is not found" });
    }

    const isSlotAvailable = selectedTurf.availableSlots.some((slot) => {
      return slot.start === startTime && slot.end === endTime;
    });

    if (!isSlotAvailable) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available" });
    }

    const existingBooking = await Booking.findOne({
      turf: turf,
      bookingDate: normalizedBookingDate,

      status: { $ne: "cancelled" },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Selected time slot is already booked",
      });
    }

    const newBooking = await Booking.create({
      user,
      turf,
      bookingDate: normalizedBookingDate,
      startTime,
      endTime,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Selected time slot is already booked",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    })
      .populate("turf")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      bookings,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId).populate("turf");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to view this booking" });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed to cancel" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user").populate("turf");
    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
