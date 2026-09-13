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
    createdBy: req.user.userId
  });

  await turf.save();
  
  return res.status(201).json({
    turf
  })
};


module.exports = {createTurf};
