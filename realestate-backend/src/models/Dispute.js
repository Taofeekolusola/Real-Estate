const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    againstUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // mediator/admin
    resolutionNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);