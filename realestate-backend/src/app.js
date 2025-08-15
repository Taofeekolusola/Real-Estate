const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizeBody = require("./middlewares/sanitize");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(sanitizeBody); // your own sanitizer middleware
app.use(morgan("dev"));

// Optional rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));


// Auth Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Admin Routes
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Property Routes
const propertyRoutes = require("./routes/property.routes");
app.use("/api/properties", propertyRoutes);

// Booking Routes
const bookingRoutes = require("./routes/booking.routes");
app.use("/api/booking", bookingRoutes);

// Payment Routes
const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);

// Dispute Routes
const disputeRoutes = require("./routes/dispute.routes");
app.use("/api/dispute", disputeRoutes);

// Rating Routes
const ratingRoutes = require("./routes/ratings.routes");
app.use("/api/ratings", ratingRoutes);

// Verify Routes
const verifyRoutes = require("./routes/verify.routes");
app.use("/api/verify", verifyRoutes);


app.get("/", (req, res) => res.send("API is running..."));

module.exports = app;