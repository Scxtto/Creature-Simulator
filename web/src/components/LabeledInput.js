import React from "react";

// LabeledInput Component
// This component renders a labeled input field with an optional tooltip.
// It is a reusable component for rendering input fields with labels in forms.

const LabeledInput = ({ label, tooltip, name, value, onChange, type = "number" }) => {
  return (
    <div className="label-input-group">
      {/* Label with optional tooltip */}
      <label title={tooltip}>{label}:</label>

      {/* Input field bound to the provided name, value, and onChange handler */}
      <input type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default LabeledInput;
