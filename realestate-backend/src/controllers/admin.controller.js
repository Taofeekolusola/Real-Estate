const User = require("../models/User");
const Property = require("../models/Property");
const Dispute = require("../models/Dispute");

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Update user status (e.g., active, suspended)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "suspended"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user status" });
  }
};

// Get all properties with landlord info
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("landlord", "name email");
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Approve a property listing
exports.approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: "Failed to approve property" });
  }
};

// Enforce rent fee on a property
exports.enforceRentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { rentFee } = req.body;

    if (typeof rentFee !== "number" || rentFee <= 0) {
      return res.status(400).json({ error: "Invalid rent fee value" });
    }

    const property = await Property.findByIdAndUpdate(id, { rentFee }, { new: true });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ message: "Rent fee enforced", property });
  } catch (err) {
    res.status(500).json({ error: "Failed to enforce rent fee" });
  }
};

// Admin: Get all disputes
exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate("raisedBy", "name email role")
      .populate("againstUser", "name email")
      .populate("property", "title address")
      .populate("assignedTo", "name email");

    res.status(200).json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Assign a mediator (admin role)
exports.assignMediator = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute not found" });
    }

    const { assignedTo } = req.body;

    const user = await User.findById(assignedTo);
    if (!user || user.role !== "admin") {
      return res.status(400).json({ success: false, message: "Assigned user must be an admin" });
    }

    dispute.assignedTo = assignedTo;
    dispute.status = "in-review";
    await dispute.save();

    res.status(200).json({ success: true, message: "Mediator assigned", dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin or assigned mediator: Update dispute status
exports.updateDisputeStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute not found" });
    }

    // Only admin or assigned mediator can update
    if (
      req.user.role !== "admin" &&
      dispute.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (status) dispute.status = status;
    if (resolutionNote) dispute.resolutionNote = resolutionNote;

    await dispute.save();

    res.status(200).json({ success: true, message: "Dispute updated", dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};