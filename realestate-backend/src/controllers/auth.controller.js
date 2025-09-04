//import { sendEmail } from '../utils/mailer';
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

//const { verifyNIN, verifyBVN } = require("../services/verify");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
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

//update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, role, nin, bvn } = req.body;
    
    // Ensures name is provided ad that it's a string
    if (!name || typeof name !== 'string') { 
      return res.status(400).json({
        message: 'Invalid name. Name is required and it must be a string.'
      });
    }
    
    // Ensures email is provided ad that it's a string and contains '@'
    if (!email || typeof email!== 'string' ||!email.includes('@')) { 
      return res.status(400).json({
        message: 'Invalid email. Email is required and it must be a valid email address.'
      });
    }
    
    // Ensures password is provided ad that it's a string and at least 8 characters long
    if (!password || typeof password!== 'string' || password.length < 8) { 
      return res.status(400).json({
        message: 'Invalid password. Password is required and it must be at least 8 characters long.'
      });
    }
    // Ensures role is either 'tenant' or 'landlord'
    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    // Fetch the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.role = role;

    // Hash the password if it has been provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });

  } catch (error) {
    console.error(err);
    res.status(500).json({
      message: 'Server error. Could not update user profile.'
    });
  }
}

//get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const sendEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,   // from .env
      pass: process.env.SMTP_PASSWORD // from .env (App Password)
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL, // must match the authenticated user
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);

  console.log("Reset link sent:", resetLink);
};


// desc: request a password reset link
// route: POST /auth/request-reset
// access: public
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }); // ✅ mongoose syntax

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Construct the reset link
    const resetLink = `http://localhost:5002/auth/reset/${token}`;

    // Send the reset link to the user's email
    await sendEmail(user.email, resetLink);

    res.json({
  message: "Password reset link sent to your email",
  token,       // 👈 add this
  resetLink    // 👈 add this
});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// desc: reset a user's password
// route: POST /auth/reset
// access: public (via token)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.id); // ✅ mongoose syntax

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};