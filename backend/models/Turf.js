const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    images: [String],
    availableSlots: [
      {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Turf = mongoose.model("Turf",TurfSchema,"turfs");
module.exports = Turf;
