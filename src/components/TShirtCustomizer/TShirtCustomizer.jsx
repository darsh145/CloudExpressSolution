import { useState, useEffect } from "react";
import SizeCustomizer from "./SizeCustomizer";
import ImageUploader from "./ImageUploader";
import TextCustomizer from "./TextCustomizer";
import TShirtViewer from "./TShirtViewer";

export default function TShirtCustomizer() {
  // Form state
  const [formData, setFormData] = useState({
    height: "180",
    weight: "80",
    build: "athletic",
    printText: "",
    color: "white",
  });

  const [customImage, setCustomImage] = useState(null);
  const [showThreeDModel, setShowThreeDModel] = useState(false);

  // Handle keyboard shortcut for 3D view toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "q" || e.key === "Q")) {
        setShowThreeDModel((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData, customImage);
    // Here you would typically send this data to your backend
    alert("Design saved successfully!");
  };

  return (
    <div>
      <h1>T-Shirt Customizer</h1>
      <p className="description">Customize your perfect t-shirt!</p>

      <div className="customizer-container">
        <div className="customizer-column">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <SizeCustomizer formData={formData} onChange={handleChange} />
            </div>

            <div className="form-group">
              <h2>Color Options</h2>
              <div className="color-options">
                {["white", "black", "red", "blue", "green"].map((color) => (
                  <label key={color} className="color-option">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={formData.color === color}
                      onChange={handleChange}
                    />
                    <div
                      className="color-swatch"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          formData.color === color ? "#4f46e5" : "#cbd5e1",
                      }}
                    ></div>
                    <span className="screen-reader-only">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <ImageUploader setCustomImage={setCustomImage} />
            </div>

            <div className="form-group">
              <TextCustomizer formData={formData} onChange={handleChange} />
            </div>

            <button type="submit" className="primary-button">
              Save Design
            </button>
          </form>

          <div>
            <button
              onClick={() => setShowThreeDModel((prev) => !prev)}
              className="secondary-button"
            >
              Toggle 3D View (Alt + Q)
            </button>
          </div>
        </div>

        <div className="customizer-column">
          <TShirtViewer
            color={formData.color}
            customImage={customImage}
            text={formData.printText}
            showThreeDModel={showThreeDModel}
            dimensions={{
              height: formData.height,
              weight: formData.weight,
              build: formData.build,
            }}
          />
        </div>
      </div>
    </div>
  );
}
