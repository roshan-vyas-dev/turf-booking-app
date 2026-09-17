const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

const createBooking = async (req, res) => {
  try {
    const { turf, bookingDate, startTime, endTime } = req.body;

    const user = req.user.userId;

    if (!turf || !bookingDate || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "All booking fields are required" });
    }

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
      bookingDate: bookingDate,
      startTime: startTime,
      endTime: endTime,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Selected time slot is already booked",
      });
    }

    const newBooking = await Booking.create({
      user,
      turf,
      bookingDate,
      startTime,
      endTime,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { createBooking };
