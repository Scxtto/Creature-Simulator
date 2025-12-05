import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimulationSettings from "../components/SimulationSettings";
import CreatureSettings from "../components/CreatureSettings";
import {
  handleSimulationChange,
  handleChange,
  addCreatureToSim,
  saveCreaturePreset,
  loadCreaturePreset,
  startSimulation,
} from "../components/HomePageFunctions"; // Import your functions
import "./HomePage.css"; // Import the CSS file

// Default creaturestate to populate fields
const defaultCreatureState = {
  speciesName: "name me",
  baseSpeed: 1.5,
  speedMultiplier: 1,
  health: 100,
  age: 0,
  ageCap: 35,
  ageRate: 0.04,
  initialPopulation: 25,
  initialFullness: 100,
  fullnessCap: 100,
  metabolicBaseRate: 1 / 16,
  metabolicRate: 1,
  energyStorageRate: 0.7,
  reserveEnergy: 0,
  dietType: "herbivore",
  dietPreference: "Plants",
  reproductionCost: 40,
  matingHungerThreshold: 50,
  reproductionCooldown: 100,
  litterSize: 1,
  mutationFactor: 0.05,
  colorR: 155,
  colorG: 255,
  colorB: 55,
  size: 5,
  skittishMultiplierBase: 10,
  skittishMultiplierScared: 20,
  attackPower: 40,
  defencePower: 10,
  fleeExhaustion: 0.05,
  fleeRecoveryFactor: 10,
};

// Default simulation settings
const defaultSimulationSettings = {
  simLength: 5400,
  foodRespawnMultiplier: 1,
  foodRespawnBase: 1,
  foodEnergy: 15,
};

// HomePage Component to manage simulation settings and creatures
// Renders the simulation settings and creature settings components
const HomePage = ({ email }) => {
  const navigate = useNavigate();
  const userEmail = email;
  const [creatures, setCreatures] = useState([]);
  const [presets, setPresets] = useState([]); // Store saved presets
  const [simulationSettings, setSimulationSettings] = useState({
    ...defaultSimulationSettings,
  });
  const [currentCreature, setCurrentCreature] = useState({
    ...defaultCreatureState,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showPresetsPopup, setShowPresetsPopup] = useState(false);

  // Load presets from local storage on component mount
  useEffect(() => {
    // Load presets from local storage if they exist
    const savedPresets = localStorage.getItem("creaturePresets");
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  // delete creature profile from list of creatures
  const deleteCreatureProfile = (index) => {
    setCreatures((prevCreatures) => prevCreatures.filter((_, i) => i !== index));
  };

  // Toggle popup for viewing creatures in simulation
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle loading a creature preset from the list of presets
  const handleLoadCreature = (preset) => {
    setCurrentCreature(preset);
    setShowPresetsPopup(false);
  };

  // Toggle popup for viewing creature presets
  const togglePresetsPopup = () => {
    setShowPresetsPopup(!showPresetsPopup);
  };

  return (
    <div className="container">
      <h1>Simulation Settings</h1>

      {/* Simulation Settings Section */}
      <SimulationSettings
        simulationSettings={simulationSettings}
        handleSimulationChange={(e) => handleSimulationChange(e, setSimulationSettings)}
      />

      {/* Creature Settings Section */}
      <CreatureSettings
        currentCreature={currentCreature}
        handleChange={(e) => handleChange(e, setCurrentCreature)}
      />

      {/* Button Group for Creature Actions */}
      <div className="button-group">
        <button onClick={() => saveCreaturePreset(currentCreature, userEmail)}>Save Creature Preset</button>
        <button onClick={() => loadCreaturePreset(userEmail, setPresets, togglePresetsPopup)}>
          Load Creature Preset
        </button>
        <button
          onClick={() =>
            addCreatureToSim(null, setCreatures, currentCreature, setCurrentCreature, defaultCreatureState)
          }
        >
          Add Creature to Sim
        </button>
        <button onClick={() => setShowPopup(!showPopup)}>View Creatures in Sim</button>
      </div>

      {/* Button to Start Simulation */}
      <div className="button-group">
        <button
          onClick={() => startSimulation(simulationSettings, creatures, navigate)}
          style={{ marginTop: "10px" }}
        >
          Start Simulation
        </button>
      </div>

      {/* Popup for Viewing Creatures in the Current Simulation */}
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Creatures in Simulation</h2>
            <div className="popup-content">
              {/* Display message if no creatures are added, otherwise list creatures */}
              {creatures.length === 0 ? (
                <p>No creature profiles saved yet.</p>
              ) : (
                creatures.map((creature, index) => (
                  <div key={index} className="creature-profile">
                    <p>
                      <strong>Species: {creature.speciesName}</strong>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCreatureProfile(index)}
                        title="Delete Creature"
                      >
                        &times;
                      </button>
                    </p>
                    {/* Display creature's color */}
                    <div
                      className="color-spot"
                      style={{
                        backgroundColor: `rgb(${creature.colorR}, ${creature.colorG}, ${creature.colorB})`,
                      }}
                    />
                    <p>Speed: {creature.speedMultiplier * creature.baseSpeed}</p>
                    <p>Metabolic Rate: {creature.metabolicRate}</p>
                    <p>
                      Fullness: {creature.initialFullness} / {creature.fullnessCap}
                    </p>
                    <p>Litter Size: {creature.litterSize}</p>
                    <p>Mutation Factor: {creature.mutationFactor}</p>
                    <p>
                      Skittish: {creature.skittishMultiplierBase} / {creature.skittishMultiplierScared}
                    </p>
                    <p>
                      Attack / Defence: {creature.attackPower} / {creature.defencePower}
                    </p>
                    <p>
                      Flee Exhaustion / stun: {creature.fleeExhaustion} / {creature.fleeRecoveryFactor}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button className="close-btn" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for Viewing Creature Presets Loaded from API */}
      {showPresetsPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Creature Presets</h2>
            <div className="popup-content">
              {/* Display message if no presets are loaded, otherwise list presets */}
              {presets.length === 0 ? (
                <p>No presets saved yet.</p>
              ) : (
                presets.map((preset, index) => (
                  <div key={index} className="creature-profile">
                    <p>
                      <strong>Species: {preset.speciesName}</strong>
                    </p>
                    {/* Display preset's color */}
                    <div
                      className="color-spot"
                      style={{
                        backgroundColor: `rgb(${preset.colorR}, ${preset.colorG}, ${preset.colorB})`,
                      }}
                    />
                    <p>Speed: {preset.speedMultiplier * preset.baseSpeed}</p>
                    <p>Metabolic Rate: {preset.metabolicRate}</p>
                    <p>
                      Fullness: {preset.initialFullness} / {preset.fullnessCap}
                    </p>
                    <p>Litter Size: {preset.litterSize}</p>
                    <p>Mutation Factor: {preset.mutationFactor}</p>
                    <p>
                      Skittish: {preset.skittishMultiplierBase} / {preset.skittishMultiplierScared}
                    </p>
                    <p>
                      Attack / Defence: {preset.attackPower} / {preset.defencePower}
                    </p>
                    <p>
                      Flee Exhaustion / stun: {preset.fleeExhaustion} / {preset.fleeRecoveryFactor}
                    </p>

                    {/* Buttons to add preset to simulation or load it */}
                    <div className="button-group">
                      <button
                        onClick={() =>
                          addCreatureToSim(
                            preset,
                            setCreatures,
                            currentCreature,
                            setCurrentCreature,
                            defaultCreatureState
                          )
                        }
                      >
                        Add to Sim
                      </button>
                      <button onClick={() => handleLoadCreature(preset)}>Load Preset</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="close-btn" onClick={togglePresetsPopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
