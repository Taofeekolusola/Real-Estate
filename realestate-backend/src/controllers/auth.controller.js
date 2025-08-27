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

// exports.verifyLoginHandler = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         const user = await Admin.findOne({ email });

//         if (!user || !user.otp) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         // Hash the entered OTP and compare with stored OTP
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         if (hashedOtp !== user.otp || user.otpExpires < Date.now()) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         // OTP is valid, clear OTP fields
//         user.otp = undefined;
//         user.otpExpires = undefined;
//         await user.save();

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         return res.json({
//             token,
//             email,
//             role: user.role,
//             profilePicture: user.profilePicture
//         }); 

//     } catch (error) {
//         console.error("OTP Verification error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// //Resend Otp code
// exports.resendOtpHandler = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await Admin.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "Admin not found" });
//         }

//         // Generate new OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         // Update OTP and expiry time (2 minutes)
//         user.otp = hashedOtp;
//         user.otpExpires = Date.now() + 2 * 60 * 1000;
//         await user.save();

//         // Send OTP email using reusable function
//         await sendOtpEmail(email, otp);

//         return res.json({ message: "OTP resent successfully" });

//     } catch (error) {
//         console.error("Resend OTP error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // Request Password Reset
// const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     const resetCode = crypto.randomInt(100000, 999999).toString();
//     const expiresAt = Date.now() + 3600000; // 1-hour expiry

//     user.resetPasswordToken = resetCode;
//     user.resetPasswordExpiresAt = expiresAt;
//     await user.save();

//     await sendEmail(user.email, resetCode);

//     return res.status(200).json({ message: "Password reset code sent to your email" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// // Verify Reset Code
// const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit reset code

// exports.verifyResetCode = async (req, res) => {
//   try {
//     const { resetCode } = req.body;

//     const user = await Admin.findOne({ resetPasswordToken: resetCode });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid reset code." });
//     }

//     // Check if the reset code is expired
//     if (!user.resetPasswordExpiresAt || Date.now() > user.resetPasswordExpiresAt) {
//       // Generate a new reset code
//       const newResetCode = generateResetCode();
//       const hashedResetCode = crypto.createHash("sha256").update(newResetCode).digest("hex");

//       // Set new reset code and expiry (15 minutes from now)
//       user.resetPasswordToken = hashedResetCode;
//       user.resetPasswordExpiresAt = Date.now() + 2 * 60 * 1000;
//       await user.save();

//       // Send the new reset code to the user's email (Simulated in console.log)
//       console.log(`New reset code sent to ${user.email}: ${newResetCode}`); // Replace with actual email sending logic

//       return res.status(400).json({ message: "Reset code expired. A new reset code has been sent to your email." });
//     }

//     // Generate the verification token
//     const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Save the verification token in the database
//     user.verificationToken = verificationToken;
//     user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now
//     await user.save();

//     return res.json({ message: "Reset code verified", verificationToken });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// exports.resendResetCodeHandler = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await Admin.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "Admin not found" });
//         }

//         // Generate new reset code
//         const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//         const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");

//         // Update reset code and expiry (2 minutes)
//         user.resetPasswordToken = hashedResetCode;
//         user.resetPasswordExpiresAt = Date.now() + 2 * 60 * 1000;
//         await user.save();

//         // Send reset code via email
//         await sendResetEmail(email, resetCode);

//         return res.json({ message: "Reset code resent successfully" });

//     } catch (error) {
//         console.error("Resend Reset Code error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // Reset Password
// exports.resetPassword = async (req, res) => {
//   try {
//     const { password, confirmPassword, resetCode, email } = req.body;
    
//     if (!email && !resetCode) {
//       return res.status(400).json({ message: "Email or reset code is required" });
//     } 

//     //const token = req.headers.authorization?.split(" ")[1];

//     // if (!token) {
//     //   return res.status(401).json({ message: "Unauthorized request" });
//     // }

//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = null;
//     user.resetPasswordExpiresAt = null;
//     await user.save();

//     return res.json({ message: "Password has been reset successfully" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, nin, bvn } = req.body;

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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, nin, bvn },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};