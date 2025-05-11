import { useState, useEffect } from "react";

export default function TShirtViewer({
  color,
  customImage,
  text,
  showThreeDModel,
  dimensions,
}) {
  const [loading3D, setLoading3D] = useState(false);

  // In a real implementation, this would be dynamically importing the Three.js components
  // and models when needed to reduce initial load time
  useEffect(() => {
    if (showThreeDModel) {
      setLoading3D(true);
      // Mock loading delay for the 3D model
      const timer = setTimeout(() => {
        setLoading3D(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showThreeDModel]);

  function render2DTShirt() {
    return (
      <div className="t-shirt-preview">
        <div className="t-shirt-base-container">
          {/* T-shirt base image */}
          <div className="t-shirt-base" style={{ backgroundColor: color }}>
            {/* Neck area */}
            <div className="t-shirt-neck"></div>

            {/* Sleeves */}
            <div
              className="t-shirt-sleeve-left"
              style={{ backgroundColor: color }}
            ></div>
            <div
              className="t-shirt-sleeve-right"
              style={{ backgroundColor: color }}
            ></div>

            {/* Custom image on t-shirt */}
            {customImage && (
              <div className="t-shirt-image">
                <img src={customImage} alt="Custom design" />
              </div>
            )}

            {/* Custom text on t-shirt */}
            {text && (
              <div className="t-shirt-text">
                <div
                  className="t-shirt-text-container"
                  style={{ color: color === "white" ? "#333" : "white" }}
                >
                  {text.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className="t-shirt-text-line"
                      style={{
                        textShadow:
                          color === "white"
                            ? "none"
                            : "1px 1px 1px rgba(0,0,0,0.5)",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size info overlay */}
            <div className="size-info">
              {dimensions.height}cm / {dimensions.weight}kg / {dimensions.build}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function render3DTShirt() {
    if (loading3D) {
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      );
    }

    return (
      <div className="threed-viewer">
        {/* This is a placeholder for the actual Three.js renderer */}
        <div className="threed-placeholder">
          <div className="threed-placeholder-emoji">🎭</div>
          <h3 className="threed-placeholder-title">3D Mode Activated</h3>
          <p className="threed-placeholder-desc">
            In the full implementation, this area would render an interactive 3D
            t-shirt model based on
            <a
              href="https://github.com/Starklord17/threejs-t-shirt"
              className="threed-placeholder-link"
              target="_blank"
              rel="noopener"
            >
              {" "}
              threejs-t-shirt
            </a>
          </p>
          <div className="threed-placeholder-dimensions">
            <div className="dimension-box">
              <strong>Height:</strong> {dimensions.height}cm
            </div>
            <div className="dimension-box">
              <strong>Weight:</strong> {dimensions.weight}kg
            </div>
            <div className="dimension-box">
              <strong>Build:</strong> {dimensions.build}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="t-shirt-viewer">
      <div className="viewer-container">
        <div className="viewer-header">
          <h2 className="viewer-title">Preview</h2>
          <div className="toggle-hint">
            <span className="kbd">Alt + Q</span> to toggle 3D
          </div>
        </div>

        {showThreeDModel ? render3DTShirt() : render2DTShirt()}
      </div>
    </div>
  );
}
