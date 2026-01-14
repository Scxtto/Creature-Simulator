const fs = require("fs");
const path = require("path");

const accountsPath = path.join(__dirname, "accounts.json");

function getAccounts() {
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

module.exports = { getAccounts, accountsPath };
