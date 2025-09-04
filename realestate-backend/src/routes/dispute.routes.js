const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/dispute.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

// User: Create dispute
router.post("/", protect, disputeController.createDispute);

// User: Get their own disputes
router.get("/", protect, disputeController.getUserDisputes);

//Tenant or Landlord delete dispute
router.delete("/:disputeId", protect, disputeController.deleteDispute);

module.exports = router;