const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/ratings.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Tenant can rate a landlord
router.post("/", protect, restrictTo("tenant"), RatingController.createRating);

//get all ratings for a landlord
router.get("/:landlordId", RatingController.getRatingsForLandlord);

//get all ratings for a tenant
router.get("/tenant/:tenantId", protect, restrictTo("landlord"), RatingController.getRatingsByTenant);

// Tenant and Admin delete rating 
router.delete("/:id", protect, restrictTo("tenant"), RatingController.deleteRating);

module.exports = router;