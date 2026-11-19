const Turf = require("../models/Turf");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");

const createTurf = async (req, res) => {
  try {
    const { name, location, pricePerHour } = req.body;

    const availableSlots = req.body.availableSlots
      ? JSON.parse(req.body.availableSlots)
      : [];

    if (!name || !location || !pricePerHour) {
      return res.status(400).json({
        message: "Name, location and price are required",
      });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );

      imageUrls = uploadedImages.map((image) => ({
        url: image.secure_url,
        publicId: image.public_id,
      }));
    }

    const turf = new Turf({
      name,
      location,
      pricePerHour,
      images: imageUrls,
      availableSlots,
      createdBy: req.user.userId,
    });

    await turf.save();

    return res.status(201).json({ turf });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
    const { id } = req.params;
    const { name, location, pricePerHour } = req.body;

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    const imagesToDelete = req.body.imagesToDelete
      ? JSON.parse(req.body.imagesToDelete)
      : [];

    const remainingImages = turf.images.filter(
      (image) => !imagesToDelete.includes(image.publicId)
    );

    if (remainingImages.length + (req.files?.length || 0) > 5) {
      return res.status(400).json({
        message: "A turf can have a maximum of 5 images",
      });
    }

    const uploadedImages = req.files?.length
      ? await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer))
        )
      : [];

    const newImages = uploadedImages.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id,
    }));

    turf.name = name;
    turf.location = location;
    turf.pricePerHour = Number(pricePerHour);
    turf.images = [...remainingImages, ...newImages];

    await turf.save();

    for (const publicId of imagesToDelete) {
      await cloudinary.uploader.destroy(publicId);
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
      message: "Turf deleted successfully",
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
