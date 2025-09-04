// controllers/payment.controller.js
const paystack = require("../config/paystack");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const generateAgreement = require("../utils/generateAgreement");
const { sendEmailWithPdf } = require("../utils/mailer");
const dotenv = require("dotenv");
dotenv.config();

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

// controllers/payment.controller.js
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const paymentData = response.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const bookingId = paymentData.metadata.bookingId;
    const leaseStartDate = paymentData.metadata.leaseStartDate;
    const leaseEndDate = paymentData.metadata.leaseEndDate;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "property",
        populate: { path: "landlord", model: "User" },
      })
      .populate("tenant");

    if (!booking || !booking.property || !booking.property.landlord) {
      return res.status(404).json({ error: "Property or landlord not found" });
    }

    booking.status = "approved";
    if (leaseStartDate) booking.leaseStartDate = leaseStartDate;
    if (leaseEndDate) booking.leaseEndDate = leaseEndDate;
    await booking.save();

    const landlord = booking.property.landlord;

    // ✅ Generate Agreement PDF buffer with digital signature
    const pdfBuffer = await generateAgreement({
      tenant: {
        name: booking.tenant.name,
        email: booking.tenant.email,
      },
      landlord: {
        name: landlord.name,
        email: landlord.email,
      },
      property: booking.property,
      rentDuration: booking.property.durationInMonths,
      rentAmount: booking.property.rentAmount,
      leaseStartDate,
      leaseEndDate,
      digitallySigned: true, // optional, true by default
    });

    // ✅ Send email with PDF attachment
    await sendEmailWithPdf({
      to: [booking.tenant.email, landlord.email],
      subject: "Lease Agreement Document",
      html: `<p>Dear ${booking.tenant.name || 'Tenant'},</p>
             <p>Your payment has been verified. Attached is your lease agreement for the property at <strong>${booking.property.address}</strong>.</p>
             <p>Regards,<br/>Lagos Rentals</p>`,
      attachment: {
        filename: "Lease-Agreement.pdf",
        content: pdfBuffer,
      },
    });

    return res.status(200).json({
      message: "Payment verified, lease agreement sent via email.",
      data: paymentData,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};