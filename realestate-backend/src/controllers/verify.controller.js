const { verifyNIN, verifyBVN } = require("../services/verify");

exports.verifyNINController = async (req, res) => {
  const { nin } = req.body;
  const result = await verifyNIN(nin);
  res.json(result);
};

exports.verifyBVNController = async (req, res) => {
  const { bvn } = req.body;
  const result = await verifyBVN(bvn);
  res.json(result);
};