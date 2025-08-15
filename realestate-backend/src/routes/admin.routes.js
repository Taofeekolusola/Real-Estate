// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Only admins can access these routes
router.use(protect, restrictTo("admin"));

router.get("/users", adminController.getAllUsers);

router.patch("/users/:id/status", adminController.updateUserStatus);

router.get("/properties", adminController.getAllProperties);

router.patch("/properties/:id/approve", adminController.approveProperty);

// router.patch("/properties/:id/rent-fee", adminController.enforceRentFee);

router.get("/all", adminController.getAllDisputes);

router.put("/:id/assign", adminController.assignMediator);

router.put("/:id/status", adminController.updateDisputeStatus);

//delete dispute
router.delete("/:id", adminController.deleteDispute);


module.exports = router;