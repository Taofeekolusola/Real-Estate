// middlewares/enforceLagosTenancyLaw.js

const MAX_YEARLY_RENT = 5_000_000; // N5M cap (adjust as needed)

module.exports = function enforceLagosTenancyLaw(req, res, next) {
  const { rentAmount, paymentOptions, agencyFee, legalFee, agreementUrl } = req.body;

  // 1. Enforce Rent Cap by Payment Frequency
  if (paymentOptions === "yearly" && rentAmount > MAX_YEARLY_RENT) {
    return res.status(400).json({
      error: "Rent exceeds legal limit for yearly payment in Lagos.",
    });
  }

  if (paymentOptions === "monthly" && rentAmount * 12 > MAX_YEARLY_RENT) {
    return res.status(400).json({
      error: "Monthly payments exceed Lagos legal annual rent limit.",
    });
  }

  // 2. Cap Legal & Agency Fees at 10%
  const maxFee = rentAmount * 0.1;
  if (agencyFee > maxFee || legalFee > maxFee) {
    return res.status(400).json({
      error: "Agency or legal fees exceed 10% of rent as allowed by law.",
    });
  }

  // 3. Rental Agreement Required
  if (!agreementUrl || agreementUrl.trim() === "") {
    return res.status(400).json({
      error: "Rental agreement document is required to publish a listing.",
    });
  }

  next(); // All validations passed
};