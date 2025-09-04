const express = require("express");
const router = express.Router();
const {
  verifyNINController,
  verifyBVNController,
} = require("../controllers/verify.controller");

router.post("/nin", verifyNINController);
router.post("/bvn", verifyBVNController);

module.exports = router;