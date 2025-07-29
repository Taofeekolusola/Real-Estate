const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String], // cloudinary URLs
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    available: { type: Boolean, default: true },

    // Admin moderation fields
    approved: { type: Boolean, default: false },
    new: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);