const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { validateRegister } = require("../middlewares/validateUser");

router.post("/register", validateRegister, AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;