const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const runSimulation = require("../processes/simulation");

const router = express.Router();

const DEFAULT_OUTPUT_DIR = path.join(__dirname, "..", "..", "publicMicro", "output");
const OUTPUT_DIR = process.env.PUBLIC_OUTPUT_DIR || DEFAULT_OUTPUT_DIR;

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

router.post("/", async (req, res) => {
  const simulationParams = req.body;
  const uniqueId = simulationParams.uniqueId || `${Date.now()}`;
  const simulationTimestamp = new Date().toISOString();

  const aspectRatio = {
    aspectWidth: 1280,
    aspectHeight: 720,
  };

  let simulationResults = {
    creatureCount: [],
    foodCount: [],
    birthCount: [],
    deathCount: [],
    distinctCreatures: {},
    deathTypeCount: {
      age: 0,
      hunger: 0,
      predation: 0,
    },
  };

  const { creatures } = simulationParams;
  if (Array.isArray(creatures)) {
    creatures.forEach((creature) => {
      const speciesName = creature.speciesName;
      if (!simulationResults.distinctCreatures[speciesName]) {
        simulationResults.distinctCreatures[speciesName] = {
          count: [],
          color: {
            r: creature.colorR,
            g: creature.colorG,
            b: creature.colorB,
          },
          births: [],
          deaths: [],
        };
      }
    });
  }

  try {
    ensureOutputDir();
    const uniqueVideoName = `simulation_${uniqueId}.mp4`;
    const videoPath = path.join(OUTPUT_DIR, uniqueVideoName);

    const simStart = process.hrtime();

    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-f",
      "rawvideo",
      "-pixel_format",
      "rgb24",
      "-video_size",
      `${aspectRatio.aspectWidth}x${aspectRatio.aspectHeight}`,
      "-r",
      "30",
      "-i",
      "pipe:0",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      videoPath,
    ]);

    ffmpeg.stdin.on("error", (error) => {
      console.error("Error writing to FFmpeg stdin:", error);
    });

    await runSimulation(simulationParams, ffmpeg, simulationResults, aspectRatio);

    await new Promise((resolve, reject) => {
      ffmpeg.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });

    const simEnd = process.hrtime(simStart);
    const duration = simEnd[0] + simEnd[1] / 1e6 / 1000;
    const computeCost = (0.096 / 3600) * duration;

    const resultData = {
      email: simulationParams.email,
      video: uniqueVideoName,
      results: simulationResults,
    };

    const jsonString = JSON.stringify(resultData);
    const resultSize = Buffer.byteLength(jsonString) / 1024 / 1024;

    return res.json({
      videoFile: uniqueVideoName,
      simResults: simulationResults,
      duration,
      computeCost,
      resultSize,
      datetime: simulationTimestamp,
      status: "success",
      nodeType: "local",
    });
  } catch (error) {
    console.error("Error processing simulation:", error);
    return res.status(500).send("Error processing simulation request");
  }
});

module.exports = router;
