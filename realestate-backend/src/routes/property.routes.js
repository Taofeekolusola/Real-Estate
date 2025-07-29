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
  PropertyController.createProperty
);
router.patch(
  "/:id",
  protect,
  restrictTo("landlord"),
  enforceLagosTenancyLaw,
  PropertyController.updateProperty
);

router.get("/", enforceLagosTenancyLaw, PropertyController.getAllProperties);
router.get("/:id", enforceLagosTenancyLaw, PropertyController.getPropertyById);

module.exports = router;