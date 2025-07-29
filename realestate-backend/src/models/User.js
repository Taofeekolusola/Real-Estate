// models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nin: { type: String },
    bvn: { type: String },
    role: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      default: "tenant",
    },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);