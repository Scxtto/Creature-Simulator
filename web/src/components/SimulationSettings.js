import React from "react";
import LabeledInput from "../components/LabeledInput";

// SimulationSettings Component
// Renders a form section for adjusting simulation-related settings
const SimulationSettings = ({ simulationSettings, handleSimulationChange }) => {
  return (
    <div className="section compact" style={{ gridColumn: "span 2" }}>
      <h2>Simulation Settings</h2>
      <div className="subsection">
        <div className="section-content">
          {/* Input for Simulation Length */}
          <LabeledInput
            label="Simulation Length"
            tooltip="Total number of simulation steps to run."
            name="simLength"
            value={simulationSettings.simLength}
            onChange={handleSimulationChange}
          />
          {/* Input for Food Respawn Multiplier */}
          <LabeledInput
            label="Food Respawn Multiplier"
            tooltip="Multiplier for the rate at which food respawns."
            name="foodRespawnMultiplier"
            value={simulationSettings.foodRespawnMultiplier}
            onChange={handleSimulationChange}
          />
          {/* Input for Food Respawn Base */}
          <LabeledInput
            label="Food Respawn Base"
            tooltip="Base value for the rate at which food respawns."
            name="foodRespawnBase"
            value={simulationSettings.foodRespawnBase}
            onChange={handleSimulationChange}
          />
          {/* Input for Energy per Food */}
          <LabeledInput
            label="Energy per Food"
            tooltip="Amount of energy each food provides."
            name="foodEnergy"
            value={simulationSettings.foodEnergy}
            onChange={handleSimulationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationSettings;
