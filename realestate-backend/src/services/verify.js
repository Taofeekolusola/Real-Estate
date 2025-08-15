// services/verify.js
exports.verifyNIN = async (nin) => {
  // Simulate NIN verification with mock logic
  if (nin && nin.length === 11) {
    return { isValid: true, name: "Verified User", nin };
  } else {
    return { isValid: false, error: "Invalid NIN format" };
  }
};

exports.verifyBVN = async (bvn) => {
  // Simulate BVN verification with mock logic
  if (bvn && bvn.length === 11) {
    return { isValid: true, name: "Verified User", bvn };
  } else {
    return { isValid: false, error: "Invalid BVN format" };
  }
};
