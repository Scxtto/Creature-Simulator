const express = require("express");
const { authenticateJWT } = require("../middleware/authenticateJwt");
const { v4: uuidv4 } = require("uuid");
const { addHistory } = require("../utility/dynamoHandler");
const { insertHistoryRecord } = require("../utility/rdsHandler");

const router = express.Router();

const SIM_MICRO_URL = process.env.SIM_MICRO_URL || "http://localhost:5001";

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const uniqueId = uuidv4();
    const simulationData = {
      ...req.body,
      uniqueId,
      email: req.decodedemail,
    };

    const response = await fetch(`${SIM_MICRO_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(simulationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Simulation request failed:", errorText);
      return res.status(500).send("Error processing simulation request");
    }

    const resultData = await response.json();
    if (!resultData || !resultData.videoFile) {
      console.error("Simulation response missing video file.");
      return res.status(500).send("Error processing simulation request");
    }

    const historyItem = {
      uuid: uniqueId,
      inputs: simulationData,
      results: resultData.simResults,
    };
    await addHistory(req.decodedemail, historyItem);

    const now = new Date().toISOString();
    await insertHistoryRecord(
      req.decodedemail,
      uniqueId,
      resultData.computeCost || 0,
      resultData.datetime || now,
      resultData.status || "success",
      resultData.nodeType || "local",
      resultData.resultSize || 0,
      resultData.duration || 0,
      resultData.failureReason || null
    );

    const videoUrl = `${req.protocol}://${req.get("host")}/videos/${resultData.videoFile}`;

    return res.status(200).json({
      videoUrl,
      simResults: resultData.simResults,
    });
  } catch (error) {
    console.error("Error in /simulate route:", error);
    return res.status(500).send("Error processing simulation request");
  }
});

module.exports = router;
