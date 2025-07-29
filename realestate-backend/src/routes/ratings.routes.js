const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/ratings.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.post("/", protect, restrictTo("tenant"), RatingController.createRating);
router.get("/:landlordId", RatingController.getRatingsForLandlord);

module.exports = router;