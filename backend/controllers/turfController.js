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

const getTurfById = async (req, res) => {
  try {
    const id = req.params.id;

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({ message: "Turf Not found" });
    }

    return res.status(200).json({ turf });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTurf = async (req, res) => {
  try {
    const id = req.params.id;

    const updates = req.body;

    const turf = await Turf.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
    });

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    return res.status(200).json({ turf });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTurf = async (req, res) => {
  try {
    const id = req.params.id;

    const turf = await Turf.findByIdAndDelete(id);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    return res.status(200).json({
      message: "Turf deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTurf,
  getAllTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
};
