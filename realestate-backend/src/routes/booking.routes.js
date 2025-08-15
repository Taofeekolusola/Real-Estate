const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/booking.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Tenant requests inspection
router.post("/request", protect, restrictTo("tenant"), BookingController.requestInspection);

// Tenant views their own bookings
router.get("/me", protect, restrictTo("tenant"), BookingController.getMyBookings);

// Landlord: view all bookings for their properties
router.get("/landlord", protect, restrictTo("landlord"), BookingController.getBookingsForLandlord);

// Landlord: approve/reject booking
router.patch("/:id/status", protect, restrictTo("landlord"), BookingController.updateBookingStatus);

//cancel booking
router.delete("/:id", protect, restrictTo("tenant"), BookingController.cancelBooking);

module.exports = router;