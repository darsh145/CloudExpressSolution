import { useState, useEffect } from "react";

export default function SizeCustomizer({ formData, onChange }) {
  const [currentHeight, setCurrentHeight] = useState(formData.height);
  const [currentWeight, setCurrentWeight] = useState(formData.weight);
  const buildOptions = ["lean", "reg", "athletic", "big"];

  // Update local state when props change
  useEffect(() => {
    setCurrentHeight(formData.height);
    setCurrentWeight(formData.weight);
  }, [formData.height, formData.weight]);

  // Handle height change
  const handleHeightChange = (e) => {
    setCurrentHeight(e.target.value);
    onChange(e);
  };

  // Handle weight change
  const handleWeightChange = (e) => {
    setCurrentWeight(e.target.value);
    onChange(e);
  };

  return (
    <div className="size-customizer">
      <h2>Body Measurements</h2>

      <div className="measurements-grid">
        {/* Height Input */}
        <div className="measurement-box">
          <label htmlFor="height">Height (cm)</label>
          <div className="range-container">
            <input
              type="range"
              id="height"
              name="height"
              min="150"
              max="210"
              step="1"
              value={currentHeight}
              onChange={handleHeightChange}
            />
            <span className="value-display">{currentHeight}</span>
          </div>
        </div>

        {/* Weight Input */}
        <div className="measurement-box">
          <label htmlFor="weight">Weight (kg)</label>
          <div className="range-container">
            <input
              type="range"
              id="weight"
              name="weight"
              min="40"
              max="150"
              step="1"
              value={currentWeight}
              onChange={handleWeightChange}
            />
            <span className="value-display">{currentWeight}</span>
          </div>
        </div>

        {/* Build Selector */}
        <div className="measurement-box">
          <label htmlFor="build">Build</label>
          <select
            id="build"
            name="build"
            value={formData.build}
            onChange={onChange}
          >
            {buildOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
