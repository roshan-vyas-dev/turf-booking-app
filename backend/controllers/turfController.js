const Turf = require("../models/Turf");

const createTurf = async (req, res) => {
  const { name, location, pricePerHour, images, availableSlots } = req.body;

  if (!name || !location || !pricePerHour) {
    return res.status(400).json({
      message: "Name, location and price are required",
    });
  }

  const turf = new Turf({
    name,
    location,
    pricePerHour,
    images,
    availableSlots,
    createdBy: req.user.userId,
  });

  await turf.save();

  return res.status(201).json({
    turf,
  });
};

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();

    return res.status(200).json({ turfs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createTurf,getAllTurfs };
