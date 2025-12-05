import { postSimParams } from "../util/postSimParams";
import { savePreset } from "../util/savePreset";
import { loadPreset } from "../util/loadPreset";
import { loginPost } from "../util/loginPost";

// Function to handle changes in simulation settings
// This updates the simulation settings state based on user input
export const handleSimulationChange = (e, setSimulationSettings) => {
  const { name, value, type } = e.target;
  setSimulationSettings((prevSettings) => ({
    ...prevSettings,
    [name]: type === "number" ? Number(value) : value, // Convert numeric input to a number type
  }));
};

// Function to handle changes in the current creature state
// This updates the creature state based on user input
export const handleChange = (e, setCurrentCreature) => {
  const { name, value, type } = e.target;
  setCurrentCreature((prevCreature) => ({
    ...prevCreature,
    [name]: type === "number" ? Number(value) : value, // Convert numeric input to a number type
  }));
};

// Function to add a creature to the simulation
// If a preset is provided, it adds the preset; otherwise, it adds the current creature
// After adding, it resets the current creature state to the default
export const addCreatureToSim = (
  preset,
  setCreatures,
  currentCreature,
  setCurrentCreature,
  defaultCreatureState
) => {
  const creatureToAdd = preset || currentCreature;
  setCreatures((prevCreatures) => [...prevCreatures, creatureToAdd]); // Add creature to the list
  setCurrentCreature({ ...defaultCreatureState }); // Reset current creature to default state
};

// Function to save the current creature as a preset
// It uses the savePreset utility and logs the outcome
export const saveCreaturePreset = async (currentCreature, userEmail) => {
  const isSaved = await savePreset(currentCreature, userEmail);

  if (isSaved) {
    console.log("Preset saved successfully.");
  } else {
    console.log("Failed to save the preset.");
  }
};

// Function to load creature presets
// It uses the loadPreset utility and updates the state with loaded presets
// If presets are loaded successfully, it toggles the presets popup
export const loadCreaturePreset = async (userEmail, setPresets, togglePresetsPopup) => {
  const presets = await loadPreset(userEmail);

  if (presets && presets.length > 0) {
    console.log("Presets loaded successfully:", presets);
    setPresets(presets); // Update presets state
    togglePresetsPopup(); // Show the presets popup
  } else {
    console.log("No presets found or failed to load.");
  }
};

// Function to start the simulation
// It posts the simulation settings and creature data to the API and navigates to the results page if successful
export const startSimulation = async (simulationSettings, creatures, navigate) => {
  const response = await postSimParams({
    simulationSettings,
    creatures,
  });

  if (response.ok) {
    const data = await response.json();
    navigate("/results", {
      state: { videoUrl: data.videoUrl, results: data.simResults }, // Pass simulation results to the results page
    });
  } else {
    console.error("Failed to start the simulation.");
  }
};

// Function to handle user login
// It posts the login credentials and sets the user email if login is successful
export const handleLogin = async (email, setUserEmail, password) => {
  const loginSuccessful = await loginPost(email, password);

  if (loginSuccessful) {
    setUserEmail(email); // Set the user email upon successful login
    console.log("Logged in successfully with:", email);
  } else {
    console.error("Login failed. Please check your credentials.");
  }
};
