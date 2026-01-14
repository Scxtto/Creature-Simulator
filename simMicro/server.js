const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const simulateRoutes = require("./routes/simulate");

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/simulate", simulateRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// app.get("/health", (req, res) => {
//   res.status(5000).send("unhealthy");
// });

app.listen(port, "0.0.0.0", () => {
  console.log("Simulation Server running on port 5001");
});
