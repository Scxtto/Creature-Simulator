import React from "react";
import LabeledInput from "../components/LabeledInput";

// The CreatureSettings component renders a form for adjusting various settings of a creature
// based on the currentCreature state and handleChange function passed in as props.
const CreatureSettings = ({ currentCreature, handleChange }) => {
  return (
    <div className="section species-settings compact">
      <h2>Species Settings</h2>

      {/* General Settings Section */}
      <div className="subsection">
        <h3>General Settings</h3>
        <div className="section-content">
          {/* Labeled input for Species Name */}
          <LabeledInput
            label="Species Name"
            tooltip="Enter the species name for this creature."
            name="speciesName"
            value={currentCreature.speciesName}
            onChange={handleChange}
            type="text"
          />
          {/* Labeled input for Base Speed */}
          <LabeledInput
            label="Base Speed"
            tooltip="Base speed determines the initial speed range of creatures."
            name="baseSpeed"
            value={currentCreature.baseSpeed}
            onChange={handleChange}
          />
          {/* Labeled input for Speed Multiplier */}
          <LabeledInput
            label="Speed Multiplier"
            tooltip="Multiplier for base movement speed of creatures."
            name="speedMultiplier"
            value={currentCreature.speedMultiplier}
            onChange={handleChange}
          />
          {/* Labeled input for Max Health */}
          <LabeledInput
            label="Max Health"
            tooltip="Maximum health of the creature."
            name="health"
            value={currentCreature.health}
            onChange={handleChange}
          />
          {/* Labeled input for Initial Age */}
          <LabeledInput
            label="Initial Age"
            tooltip="Initial age of the creature."
            name="age"
            value={currentCreature.age}
            onChange={handleChange}
          />
          {/* Labeled input for Age Cap */}
          <LabeledInput
            label="Age Cap"
            tooltip="Maximum age of the creature before death by old age."
            name="ageCap"
            value={currentCreature.ageCap}
            onChange={handleChange}
          />
          {/* Labeled input for Rate of Aging */}
          <LabeledInput
            label="Rate of Aging"
            tooltip="Rate at which the creature ages per step."
            name="ageRate"
            value={currentCreature.ageRate}
            onChange={handleChange}
          />
          {/* Labeled input for Initial Population */}
          <LabeledInput
            label="Initial Population"
            tooltip="Initial population of the creature."
            name="initialPopulation"
            value={currentCreature.initialPopulation}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Diet Settings Section */}
      <div className="subsection">
        <h3>Diet Settings</h3>
        <div className="section-content">
          {/* Labeled input for Initial Fullness */}
          <LabeledInput
            label="Initial Fullness"
            tooltip="Initial fullness level of creatures."
            name="initialFullness"
            value={currentCreature.initialFullness}
            onChange={handleChange}
          />
          {/* Labeled input for Fullness Cap */}
          <LabeledInput
            label="Fullness Cap"
            tooltip="Maximum fullness level a creature can reach before storing excess energy."
            name="fullnessCap"
            value={currentCreature.fullnessCap}
            onChange={handleChange}
          />
          {/* Labeled input for Metabolic Base Rate */}
          <LabeledInput
            label="Metabolic Base Rate"
            tooltip="Metabolic base rate of the creature."
            name="metabolicBaseRate"
            value={currentCreature.metabolicBaseRate}
            onChange={handleChange}
          />
          {/* Labeled input for Metabolism Multiplier */}
          <LabeledInput
            label="Metabolism Multiplier"
            tooltip="Rate at which creatures use up their energy."
            name="metabolicRate"
            value={currentCreature.metabolicRate}
            onChange={handleChange}
          />
          {/* Labeled input for Energy Storage Rate */}
          <LabeledInput
            label="Energy Storage Rate"
            tooltip="Rate at which excess energy is stored when fullness exceeds max level."
            name="energyStorageRate"
            value={currentCreature.energyStorageRate}
            onChange={handleChange}
          />
          {/* Labeled input for Initial Reserve Energy */}
          <LabeledInput
            label="Initial Reserve Energy"
            tooltip="Reserve energy stored by the creature."
            name="reserveEnergy"
            value={currentCreature.reserveEnergy}
            onChange={handleChange}
          />
          {/* Dropdown for selecting Diet Type */}
          <div className="label-input-group">
            <label title="The diet type of the creature: herbivore, omnivore, or carnivore.">
              Diet Type:
            </label>
            <select name="dietType" value={currentCreature.dietType} onChange={handleChange}>
              <option value="herbivore">Herbivore</option>
              <option value="omnivore">Omnivore</option>
              <option value="carnivore">Carnivore</option>
            </select>
          </div>

          {/* Conditional dropdown for Diet Preference (only shown for omnivores) */}
          {currentCreature.dietType === "omnivore" && (
            <div className="label-input-group">
              <label title="Preferred diet when omnivore: Plants or Meat.">Diet Preference:</label>
              <select
                name="dietPreference"
                value={currentCreature.dietPreference || "Plants"}
                onChange={handleChange}
              >
                <option value="Plants">Plants</option>
                <option value="Meat">Meat</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Reproduction Settings Section */}
      <div className="subsection">
        <h3>Reproduction Settings</h3>
        <div className="section-content">
          {/* Labeled input for Reproduction Cost */}
          <LabeledInput
            label="Reproduction Cost"
            tooltip="Energy cost of reproduction, deducted from the creature's fullness."
            name="reproductionCost"
            value={currentCreature.reproductionCost}
            onChange={handleChange}
          />
          {/* Labeled input for Hunger Threshold to Mate */}
          <LabeledInput
            label="Hunger Threshold to Mate"
            tooltip="The hunger threshold a creature must reach before it can reproduce."
            name="matingHungerThreshold"
            value={currentCreature.matingHungerThreshold}
            onChange={handleChange}
          />
          {/* Labeled input for Reproduction Cooldown */}
          <LabeledInput
            label="Reproduction Cooldown"
            tooltip="Time (in steps) a creature must wait before reproducing again."
            name="reproductionCooldown"
            value={currentCreature.reproductionCooldown}
            onChange={handleChange}
          />
          {/* Labeled input for Litter Size */}
          <LabeledInput
            label="Litter Size"
            tooltip="Number of offspring produced per reproduction event."
            name="litterSize"
            value={currentCreature.litterSize}
            onChange={handleChange}
          />
          {/* Labeled input for Mutation Factor */}
          <LabeledInput
            label="Mutation Factor"
            tooltip="Factor determining the rate of mutations during reproduction."
            name="mutationFactor"
            value={currentCreature.mutationFactor}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Behavioral Settings Section */}
      <div className="subsection">
        <h3>Behavioral Settings</h3>
        <div className="section-content">
          {/* Labeled input for Skittish Multiplier (Base) */}
          <LabeledInput
            label="Skittish Multiplier (Base)"
            tooltip="Base multiplier for how skittish the creature is."
            name="skittishMultiplierBase"
            value={currentCreature.skittishMultiplierBase}
            onChange={handleChange}
          />
          {/* Labeled input for Skittish Multiplier (Scared) */}
          <LabeledInput
            label="Skittish Multiplier (Scared)"
            tooltip="Multiplier for how skittish the creature becomes when scared."
            name="skittishMultiplierScared"
            value={currentCreature.skittishMultiplierScared}
            onChange={handleChange}
          />
          {/* Labeled input for Attack Power */}
          <LabeledInput
            label="Attack Power"
            tooltip="The power of the creature's attacks."
            name="attackPower"
            value={currentCreature.attackPower}
            onChange={handleChange}
          />
          {/* Labeled input for Defense Power */}
          <LabeledInput
            label="Defense Power"
            tooltip="The defensive strength of the creature."
            name="defencePower"
            value={currentCreature.defencePower}
            onChange={handleChange}
          />
          {/* Labeled input for Flee Exhaustion */}
          <LabeledInput
            label="Flee Exhaustion"
            tooltip="The amount of exhaustion the creature gains when fleeing."
            name="fleeExhaustion"
            value={currentCreature.fleeExhaustion}
            onChange={handleChange}
          />
          {/* Labeled input for Flee Recovery Factor */}
          <LabeledInput
            label="Flee Recovery Factor"
            tooltip="The rate at which the creature recovers from exhaustion after fleeing."
            name="fleeRecoveryFactor"
            value={currentCreature.fleeRecoveryFactor}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Appearance Settings Section */}
      <div className="subsection">
        <h3>Appearance Settings</h3>
        <div className="section-content">
          {/* Labeled input for Color (R) */}
          <LabeledInput
            label="Color (R)"
            tooltip="Red color value (0-255) for the creatures."
            name="colorR"
            value={currentCreature.colorR}
            onChange={handleChange}
          />
          {/* Labeled input for Color (G) */}
          <LabeledInput
            label="Color (G)"
            tooltip="Green color value (0-255) for the creatures."
            name="colorG"
            value={currentCreature.colorG}
            onChange={handleChange}
          />
          {/* Labeled input for Color (B) */}
          <LabeledInput
            label="Color (B)"
            tooltip="Blue color value (0-255) for the creatures."
            name="colorB"
            value={currentCreature.colorB}
            onChange={handleChange}
          />
          {/* Labeled input for Size */}
          <LabeledInput
            label="Size"
            tooltip="Size of the creature."
            name="size"
            value={currentCreature.size}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatureSettings;
