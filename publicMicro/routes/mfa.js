const express = require("express");
const router = express.Router();
router.all("*", (req, res) => {
  res.status(501).json({ message: "MFA is not supported" });
});

module.exports = router;
