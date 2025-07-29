const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/property.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../utils/upload");

// 👇 Accept up to 5 image files
router.post(
  "/",
  protect,
  restrictTo("landlord"),
  upload.array("images", 5),
  PropertyController.createProperty
);

router.get("/", PropertyController.getAllProperties);

module.exports = router;
