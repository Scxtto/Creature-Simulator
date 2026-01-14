const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "..", "storage");
const presetsPath = path.join(storageDir, "presets.json");
const historyPath = path.join(storageDir, "history.json");

function ensureStorage() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (!fs.existsSync(presetsPath)) {
    fs.writeFileSync(presetsPath, JSON.stringify({ byEmail: {} }, null, 2), "utf-8");
  }

  if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify({ byEmail: {} }, null, 2), "utf-8");
  }
}

function readJson(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.trim()) {
    return defaultValue;
  }

  const parsed = JSON.parse(raw);
  return parsed || defaultValue;
}

function writeJsonSafely(filePath, data) {
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

async function createTable() {
  ensureStorage();
}

async function addHistory(email, historyItem) {
  ensureStorage();
  const history = readJson(historyPath, { byEmail: {} });
  if (!history.byEmail[email]) {
    history.byEmail[email] = [];
  }
  history.byEmail[email].push(historyItem);
  writeJsonSafely(historyPath, history);
}

async function retrieveByUUID(email, uuid) {
  ensureStorage();
  const history = readJson(historyPath, { byEmail: {} });
  const userHistory = history.byEmail[email] || [];
  return userHistory.find((item) => item.uuid === uuid) || null;
}

async function addPreset(email, presetItem) {
  ensureStorage();
  const presets = readJson(presetsPath, { byEmail: {} });
  if (!presets.byEmail[email]) {
    presets.byEmail[email] = [];
  }
  presets.byEmail[email].push(presetItem);
  writeJsonSafely(presetsPath, presets);
}

async function loadPresets(email) {
  ensureStorage();
  const presets = readJson(presetsPath, { byEmail: {} });
  return presets.byEmail[email] || [];
}

async function retrieveAll(email) {
  ensureStorage();
  const history = readJson(historyPath, { byEmail: {} });
  const presets = readJson(presetsPath, { byEmail: {} });
  return {
    email,
    history: history.byEmail[email] || [],
    presets: presets.byEmail[email] || [],
  };
}

module.exports = { createTable, addHistory, retrieveAll, addPreset, loadPresets, retrieveByUUID };
