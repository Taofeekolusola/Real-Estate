const Dispute = require("../models/Dispute");
const User = require("../models/User");
const Property = require("../models/Property");

// Create a dispute
exports.createDispute = async (req, res) => {
  try {
    const { againstUser, property, description } = req.body;

    const dispute = await Dispute.create({
      raisedBy: req.user._id,
      againstUser,
      property,
      description,
    });

    res.status(201).json({ success: true, dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get disputes raised by the logged-in user
exports.getUserDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user._id })
      .populate("againstUser", "name email")
      .populate("property", "title address")
      .populate("assignedTo", "name email");

    res.status(200).json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};