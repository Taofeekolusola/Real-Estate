const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/property.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const enforceLagosTenancyLaw = require("../middlewares/enforceLagosTenancyLaw");
const upload = require("../utils/upload");

// 👇 Accept up to 5 image files
router.post(
  "/",
  protect,
  restrictTo("landlord"),
  upload.array("images", 5),
  enforceLagosTenancyLaw,
  PropertyController.createProperty
);
router.put(
  "/:id",
  protect,
  restrictTo("landlord"),
  upload.array("images", 5),
  enforceLagosTenancyLaw,
  PropertyController.updateProperty
);
router.delete("/:id", protect, restrictTo("landlord"), PropertyController.deleteProperty);
router.get("/", PropertyController.getAllProperties);
router.get("/:id", PropertyController.getPropertyById);

module.exports = router;