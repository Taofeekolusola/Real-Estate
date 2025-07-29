// controllers/payment.controller.js
const paystack = require("../config/paystack");
const Booking = require("../models/Booking");
const Property = require("../models/Property");

exports.initializePayment = async (req, res) => {
  try {
    const { email, amount, bookingId } = req.body;

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100, // Paystack works in kobo
      metadata: {
        bookingId,
      },
    });

    return res.status(200).json({
      message: "Payment initialized",
      data: response.data.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "Payment initialization failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const bookingId = paymentData.metadata.bookingId;

      // Update booking to "paid"
      await Booking.findByIdAndUpdate(bookingId, {
        status: "paid",
      });

      return res.status(200).json({ message: "Payment verified and booking confirmed", data: paymentData });
    } else {
      return res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};