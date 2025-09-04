const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const sendEmail = require("../utils/mailer");
const Violation = require("../models/Violation");
require('dotenv').config();

exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      rentAmount,
      paymentOptions,
      agencyFee = 0,
      legalFee = 0,
      agreementUrl,
      durationInMonths,
    } = req.body;

    const landlordId = req.user._id;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(base64String, {
          folder: "realestate/properties",
        });
        imageUrls.push(result.secure_url);
      }
    }

    // === Violation Check (content + tenancy laws) ===
    const violations = [];

    // Content checks
    if (!description || description.trim().length < 10) {
      violations.push("Description too short or missing");
    }

    if (durationInMonths < 6 || durationInMonths > 12) {
      return res.status(400).json({
        status: "error",
        message: "Rent duration must be between 6 and 12 months per Lagos tenancy law",
      });
    }

    if (Number(rentAmount) < 1000) {
      violations.push("Rent amount seems too low");
    }

    const bannedWords = ["scam", "fake", "fraud"];
    for (const word of bannedWords) {
      if (description && description.toLowerCase().includes(word)) {
        violations.push(`Contains banned word: ${word}`);
      }
    }

    // Lagos Tenancy Law checks
    const monthlyRent =
      paymentOptions === "monthly"
        ? rentAmount
        : paymentOptions === "quarterly"
        ? rentAmount / 3
        : rentAmount / 12;

    const annualRent = monthlyRent * 12;
    const MAX_ANNUAL_RENT = 3000000;
    const MAX_PERCENTAGE_FEES = 0.1;
    const maxFee = rentAmount * MAX_PERCENTAGE_FEES;

    if (annualRent > MAX_ANNUAL_RENT) {
      violations.push(
        `Annualized rent is ₦${annualRent}, exceeds ₦${MAX_ANNUAL_RENT}`
      );
    }

    if (agencyFee > maxFee) {
      violations.push(
        `Agency fee is ₦${agencyFee}, exceeds 10% of rent (₦${maxFee})`
      );
    }

    if (legalFee > maxFee) {
      violations.push(
        `Legal fee is ₦${legalFee}, exceeds 10% of rent (₦${maxFee})`
      );
    }

    if (!agreementUrl || typeof agreementUrl !== "string") {
      violations.push("Missing tenancy agreement URL");
    }

    const isFlagged = violations.length > 0;

    // === Save property ===
    const newProperty = new Property({
      title,
      description,
      address,
      images: imageUrls,
      landlord: landlordId,
      rentAmount,
      paymentOptions,
      agencyFee,
      legalFee,
      agreementUrl,
      approved: false,
      new: true,
      flagged: isFlagged,
      durationInMonths,
    });

    await newProperty.save();

    // === Log violations & notify ===
    if (isFlagged) {
      await Violation.create({
        property: newProperty._id,
        landlord: landlordId,
        violations,
        resolved: false,
      });

      const landlord = await User.findById(landlordId);
      if (landlord?.email) {
        await sendEmail({
          to: landlord.email,
          subject: "⚠️ Your property has been flagged",
          html: `
            <p>Dear ${landlord.name || "Landlord"},</p>
            <p>Your listing titled <strong>${title}</strong> has been flagged for the following reason(s):</p>
            <ul>
              ${violations.map(v => `<li>${v}</li>`).join("")}
            </ul>
            <p>Please review and correct the issues before resubmitting.</p>
            <p>– Lagos Rentals Compliance Team</p>
          `,
        });
      }
    }

    res.status(201).json({
      message: isFlagged
        ? "Property created and flagged for policy violations"
        : "Property created successfully",
      property: newProperty,
    });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// Update property details
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      address,
      rentAmount,
      paymentOptions,
      agencyFee = 0,
      legalFee = 0,
      agreementUrl,
      durationInMonths,
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(base64String, {
          folder: "realestate/properties",
        });
        imageUrls.push(result.secure_url);
      }
    }

    // === Violation Check (content + tenancy laws) ===
    const violations = [];

    if (!description || description.trim().length < 10) {
      violations.push("Description too short or missing");
    }

    if (Number(rentAmount) < 1000) {
      violations.push("Rent amount seems too low");
    }

    if (durationInMonths < 6 || durationInMonths > 12) {
      return res.status(400).json({
        status: "error",
        message: "Rent duration must be between 6 and 12 months per Lagos tenancy law",
      });
    }

    const bannedWords = ["scam", "fake", "fraud"];
    for (const word of bannedWords) {
      if (description && description.toLowerCase().includes(word)) {
        violations.push(`Contains banned word: ${word}`);
      }
    }

    const monthlyRent =
      paymentOptions === "monthly"
        ? rentAmount
        : paymentOptions === "quarterly"
        ? rentAmount / 3
        : rentAmount / 12;

    const annualRent = monthlyRent * 12;
    const MAX_ANNUAL_RENT = 3000000;
    const MAX_PERCENTAGE_FEES = 0.1;
    const maxFee = rentAmount * MAX_PERCENTAGE_FEES;

    if (annualRent > MAX_ANNUAL_RENT) {
      violations.push(
        `Annualized rent is ₦${annualRent}, exceeds ₦${MAX_ANNUAL_RENT}`
      );
    }

    if (agencyFee > maxFee) {
      violations.push(
        `Agency fee is ₦${agencyFee}, exceeds 10% of rent (₦${maxFee})`
      );
    }

    if (legalFee > maxFee) {
      violations.push(
        `Legal fee is ₦${legalFee}, exceeds 10% of rent (₦${maxFee})`
      );
    }

    if (!agreementUrl || typeof agreementUrl !== "string") {
      violations.push("Missing tenancy agreement URL");
    }

    const isFlagged = violations.length > 0;

    const updateData = {
      title,
      description,
      address,
      rentAmount,
      paymentOptions,
      agencyFee,
      legalFee,
      agreementUrl,
      flagged: isFlagged,
      durationInMonths,
    };

    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (isFlagged) {
      await Violation.create({
        property: updatedProperty._id,
        landlord: updatedProperty.landlord,
        violations,
        resolved: false,
      });

      const landlord = await User.findById(updatedProperty.landlord);
      if (landlord?.email) {
        await sendEmail({
          to: landlord.email,
          subject: "⚠️ Your updated property was flagged",
          html: `
            <p>Dear ${landlord.name || "Landlord"},</p>
            <p>Your updated property titled <strong>${title}</strong> has been flagged for the following reason(s):</p>
            <ul>
              ${violations.map(v => `<li>${v}</li>`).join("")}
            </ul>
            <p>Please review and correct the issues.</p>
            <p>– Lagos Rentals Compliance Team</p>
          `,
        });
      }
    }

    res.status(200).json({
      message: isFlagged
        ? "Property updated but flagged for review"
        : "Property updated successfully",
      property: updatedProperty,
    });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ error: "Failed to update property" });
  }
};

// Get all properties with landlord info
exports.getAllProperties = async (req, res) => {
  const properties = await Property.find().populate("landlord", "fullName email");
  res.json(properties);
};

// Get property by ID with landlord info
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate("landlord", "fullName email");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
}

// Delete property by id
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({
      message: "Property deleted successfully",
      property: deletedProperty,
    });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ error: "Failed to delete property" });
  }
}