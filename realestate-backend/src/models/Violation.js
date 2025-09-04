const mongoose = require("mongoose");

const violationLogSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ViolationLog", violationLogSchema);
