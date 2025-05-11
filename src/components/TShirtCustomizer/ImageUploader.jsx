import { useState, useRef } from "react";

export default function ImageUploader({ setCustomImage }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    "/images/default-shirt-image.svg"
  ); // Updated path to our SVG
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if the file is an image
    if (file.type.match("image.*")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setCustomImage(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file (png, jpg, jpeg, etc.)");
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="image-uploader">
      <h2>Design Image</h2>

      <div
        className={`dropzone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
            <button
              className="remove-image-btn"
              onClick={() => {
                setPreviewUrl("/images/default-shirt-image.svg"); // Updated path here as well
                setCustomImage(null);
              }}
              type="button"
            >
              ×
            </button>
          </div>
        ) : null}

        <p className="dropzone-text">
          Drag & drop your image here, or click to select a file
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        <button
          className="select-file-btn"
          onClick={onButtonClick}
          type="button"
        >
          Select Image
        </button>
      </div>

      <p className="image-uploader-note">
        Recommended: PNG or JPG, max 5MB. For best results, use images with
        transparent backgrounds.
      </p>
    </div>
  );
}
