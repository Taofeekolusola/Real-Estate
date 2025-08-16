const Booking = require("../models/Booking");
const Property = require("../models/Property");
//const { sendEmail } = require('../utils/mailer');

exports.requestInspection = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    const newBooking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      message,
    });

    res.status(201).json({ message: "Inspection requested", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate("property", "title address")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings for landlord's properties
exports.getBookingsForLandlord = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).select("_id");

    const bookings = await Booking.find({ property: { $in: properties } })
      .populate("tenant", "name email")
      .populate("property", "title address");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id)
      .populate('tenant', 'email name')
      .populate('property', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    let payLink = null;

    if (status === 'approved') {
      // Generate payment link directly (no email sending)
      payLink = `${process.env.CLIENT_BASE_URL}/pay?bookingId=${booking._id}`;
    }

    res.status(200).json({ 
      message: `Booking updated to ${status}`, 
      payLink 
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Tenant Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}