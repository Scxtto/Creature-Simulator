const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { getAccounts } = require("../utility/getAccounts");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const TOKEN_DURATION_SECONDS = Number(process.env.JWT_DURATION_SECONDS || 3600);

// Route to login a user
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let accounts;
  try {
    accounts = getAccounts();
  } catch (error) {
    console.error("Error reading accounts:", error);
    return res.status(500).json({ message: "Unable to load accounts" });
  }

  const account = accounts.find((user) => user.email === email && user.password === password);
  if (!account) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isAdmin = Boolean(account.isAdmin || account.role === "admin");
  const role = account.role || (isAdmin ? "admin" : "user");

  const token = jwt.sign({ email, role, isAdmin }, JWT_SECRET, {
    expiresIn: TOKEN_DURATION_SECONDS,
  });

  return res.status(200).json({
    token,
    token_type: "Bearer",
    duration: TOKEN_DURATION_SECONDS,
    isAdmin,
  });
});

module.exports = router;
