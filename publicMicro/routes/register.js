const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const accountsPath = path.join(__dirname, "../utility/accounts.json");

function readAccounts() {
  if (!fs.existsSync(accountsPath)) {
    return [];
  }

  const raw = fs.readFileSync(accountsPath, "utf-8");
  if (!raw.trim()) {
    return [];
  }

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeAccountsSafely(accounts) {
  const dir = path.dirname(accountsPath);
  const tempPath = path.join(dir, `accounts.${Date.now()}.tmp`);
  fs.writeFileSync(tempPath, JSON.stringify(accounts, null, 2), "utf-8");
  fs.renameSync(tempPath, accountsPath);
}

// Route to handle user registration and auto-confirm email
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const accounts = readAccounts();
    if (accounts.find((user) => user.email === email)) {
      return res.status(409).json({ message: "Account with this email already exists" });
    }

    accounts.push({ email, password, role: "user", isAdmin: false });
    writeAccountsSafely(accounts);

    res.status(200).json({
      message: "User registered successfully",
      email,
      isAdmin: false,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

module.exports = router;
