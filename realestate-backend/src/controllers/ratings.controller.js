const Rating = require("../models/Rating");
const User = require("../models/User");

exports.createRating = async (req, res) => {
  try {
    const { landlordId, rating, comment } = req.body;

    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can rate landlords" });
    }

    const landlord = await User.findById(landlordId);
    if (!landlord || landlord.role !== "landlord") {
      return res.status(404).json({ message: "Landlord not found" });
    }

    const newRating = await Rating.create({
      tenant: req.user._id,
      landlord: landlordId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Rating submitted", data: newRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsForLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;

    const ratings = await Rating.find({ landlord: landlordId })
      .populate("tenant", "name")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ratings by a particular tenant
exports.getRatingsByTenant = async (req, res) => {
  try {
    const ratings = await Rating.find({ tenant: req.user._id })
      .populate("landlord", "name")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Tenant and Admin Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Only the tenant who created the rating can delete it
    if (rating.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this rating" });
    }

    await Rating.findByIdAndDelete(id);
    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}