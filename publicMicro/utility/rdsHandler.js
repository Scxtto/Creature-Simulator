const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "..", "storage");
const historyCsvPath = path.join(storageDir, "history.csv");

const CSV_HEADERS = [
  "email",
  "sim_uuid",
  "datetime",
  "compute_cost",
  "status",
  "node_type",
  "result_size",
  "duration",
  "failure_reason",
];

function ensureHistoryCsv() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (!fs.existsSync(historyCsvPath)) {
    fs.writeFileSync(historyCsvPath, `${CSV_HEADERS.join(",")}\n`, "utf-8");
  }
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, "\"\"")}"`;
  }
  return str;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseHistoryRows() {
  ensureHistoryCsv();
  const raw = fs.readFileSync(historyCsvPath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) {
    return [];
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    CSV_HEADERS.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    row.compute_cost = row.compute_cost ? Number(row.compute_cost) : 0;
    row.result_size = row.result_size ? Number(row.result_size) : 0;
    row.duration = row.duration ? Number(row.duration) : 0;
    rows.push(row);
  }

  return rows;
}

async function createHistoryTable() {
  ensureHistoryCsv();
}

async function retrieveHistory(email) {
  const rows = parseHistoryRows();
  const filtered = rows.filter((row) => row.email === email);
  return filtered.length > 0 ? filtered : null;
}

async function retrieveAllHistory() {
  const rows = parseHistoryRows();
  return rows.length > 0 ? rows : null;
}

async function insertHistoryRecord(
  email,
  simUUID,
  computeCost,
  datetime,
  status,
  nodeType = null,
  resultSize = null,
  duration = null,
  failureReason = null
) {
  ensureHistoryCsv();
  const row = [
    email,
    simUUID,
    datetime,
    computeCost,
    status,
    nodeType,
    resultSize,
    duration,
    failureReason,
  ].map(escapeCsvValue);

  fs.appendFileSync(historyCsvPath, `${row.join(",")}\n`, "utf-8");

  return {
    email,
    sim_uuid: simUUID,
    datetime,
    compute_cost: computeCost,
    status,
    node_type: nodeType,
    result_size: resultSize,
    duration,
    failure_reason: failureReason,
  };
}

module.exports = { retrieveHistory, retrieveAllHistory, createHistoryTable, insertHistoryRecord };
