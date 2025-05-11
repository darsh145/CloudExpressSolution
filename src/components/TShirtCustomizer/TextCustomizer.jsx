import React, { useState } from "react";

export default function TextCustomizer({ formData, onChange }) {
  const [charCount, setCharCount] = useState(formData.printText.length);
  const maxChars = 100;

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setCharCount(text.length);
      onChange(e);
    }
  };

  return (
    <div className="text-customizer">
      <h2>Custom Text</h2>
      <div className="text-input-container">
        <textarea
          name="printText"
          value={formData.printText}
          onChange={handleTextChange}
          placeholder="Enter text to print on your t-shirt (max 3 lines)"
          rows={3}
        />
      </div>

      <div className="guidelines">
        <p className={charCount > maxChars ? "text-error" : ""}>
          {charCount}/{maxChars} characters
        </p>
        <p>
          • Your text will be printed as shown above
          <br />
          • Maximum 3 lines of text
          <br />• Font will be automatically sized to fit
        </p>
      </div>
    </div>
  );
}
