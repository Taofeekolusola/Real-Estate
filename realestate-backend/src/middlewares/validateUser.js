// middlewares/validateUser.js
const { body, validationResult } = require("express-validator");

exports.validateRegister = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
    body("role").isIn(["tenant", "landlord", "admin"]).withMessage("Invalid role"),
    body("phone").notEmpty().withMessage("Phone number is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];