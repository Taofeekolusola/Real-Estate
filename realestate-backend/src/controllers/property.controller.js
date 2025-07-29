const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

exports.createProperty = async (req, res) => {
  try {
    const { title, description, address, price } = req.body;

    const landlordId = req.user._id;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      // Upload each image buffer to Cloudinary
      for (const file of req.files) {
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(base64String, {
          folder: "realestate/properties",
        });
        imageUrls.push(result.secure_url);
      }
    }

    const newProperty = new Property({
      title,
      description,
      address,
      price,
      images: imageUrls,
      landlord: landlordId,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllProperties = async (req, res) => {
  const properties = await Property.find().populate("landlord", "fullName email");
  res.json(properties);
};