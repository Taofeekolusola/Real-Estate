const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyNIN, verifyBVN } = require("../services/verify");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, nin, bvn } = req.body;

    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Verify NIN
    if (nin) {
      const ninResult = await verifyNIN(nin);
      if (!ninResult.isValid) {
        return res.status(400).json({ message: ninResult.error });
      }
    }

    // Verify BVN
    if (bvn) {
      const bvnResult = await verifyBVN(bvn);
      if (!bvnResult.isValid) {
        return res.status(400).json({ message: bvnResult.error });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      nin,
      bvn,
      isVerified: !!(nin && bvn), // set true only if both are valid
    });

    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};