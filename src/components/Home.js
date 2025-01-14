import React, { useState } from "react";
import Button from "../layouts/Button";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ["image/png", "image/jpeg", "image/jpg", "application/dicom"];
      if (validFormats.includes(file.type)) {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid file type. Please upload a CT image in PNG, JPEG, JPG, or DICOM format.");
        setSelectedFile(null);
      }
    }
  };

  // Handle form submission
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("No file selected. Please upload a CT image.");
      return;
    }

    setErrorMessage("");
    setProgress(0);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "https://your-backend-url.com/upload", true);

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded / event.total) * 100);
          setProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setIsUploading(false);
          alert("File uploaded successfully!");
        } else {
          setIsUploading(false);
          alert("Error uploading file. Please try again.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        alert("An error occurred while uploading the file.");
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Upload Error:", error);
      setIsUploading(false);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div className="hero-section">
      <div className="content-container space-y-5">
        <h1 className="heading">Revolutionizing Medical Report Analysis</h1>
        <p>Experience the seamless reading of your medical reports with MedRead</p>

        {/* File Upload Input */}
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .dcm"
          onChange={handleFileChange}
          className="file-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Progress Bar */}
        {isUploading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button title="Upload File" onClick={handleUpload} />
      </div>
    </div>
  );
};

export default Home;
