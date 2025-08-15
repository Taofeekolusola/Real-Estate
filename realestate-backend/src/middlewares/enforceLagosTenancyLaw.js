const ViolationLog = require("../models/Violation");

const MAX_ANNUAL_RENT = 10000000; // ₦3,000,000
const MAX_PERCENTAGE_FEES = 0.1; // 10%


module.exports = async function enforceLagosTenancyLaw(req, res, next) {
  const {
    rentAmount,
    paymentOptions,
    agencyFee = 0,
    legalFee = 0,
    agreementUrl,
  } = req.body;

  const landlordId = req.user._id;

  const monthlyRent =
    paymentOptions === "monthly"
      ? rentAmount
      : paymentOptions === "quarterly"
      ? rentAmount / 3
      : rentAmount / 12;

  const annualRent = monthlyRent * 12;

  let violations = [];

  if (annualRent > MAX_ANNUAL_RENT) {
    violations.push({
      reason: "Rent exceeds Lagos tenancy cap",
      detail: `Annualized rent is ₦${annualRent}, max allowed is ₦${MAX_ANNUAL_RENT}`,
    });
  }

  const maxFee = rentAmount * MAX_PERCENTAGE_FEES;

  if (agencyFee > maxFee) {
    violations.push({
      reason: "Agency fee exceeds 10% of rent",
      detail: `Agency fee is ₦${agencyFee}, max allowed is ₦${maxFee}`,
    });
  }

  if (legalFee > maxFee) {
    violations.push({
      reason: "Legal fee exceeds 10% of rent",
      detail: `Legal fee is ₦${legalFee}, max allowed is ₦${maxFee}`,
    });
  }

  if (!agreementUrl || typeof agreementUrl !== "string") {
    violations.push({
      reason: "Missing tenancy agreement",
      detail: "Every rental must have an agreement URL",
    });
  }

  if (violations.length > 0) {
    const violationEntries = violations.map((v) => ({
      landlord: landlordId,
      property: null,
      reason: v.reason,
      details: v,
    }));

    await ViolationLog.insertMany(violationEntries);

    return res.status(400).json({
      status: "error",
      message: "Your property violates Lagos Tenancy Law.",
      violations,
    });
  }

  next();
};