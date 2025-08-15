const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { validateRegister } = require("../middlewares/validateUser");
const {protect} = require("../middlewares/auth.middleware");

router.post("/register", validateRegister, AuthController.register);
router.post("/login", AuthController.login);
router.get('/verify', protect, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;