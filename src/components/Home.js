import React, { useState } from "react";
import Button from "../layouts/Button";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null); 

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

      xhr.open("POST", "http://127.0.0.1:5000/predict", true);  // Ensure the Flask backend URL is correct

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

          const response = JSON.parse(xhr.responseText);  // Get the response from backend
          setPredictionResult(response);  // Log the prediction details or success message in the console
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setErrorMessage(errorResponse.message || "Error uploading file. Please try again.");
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
            
            {progress < 100 && (
              <div className="spinner"></div> // Display spinner until upload is complete
            )}
          </div>
        )}

        {/* Upload Button */}
        
        <button onClick={handleUpload} className="button">Upload File</button>

        {predictionResult && (
          <div className="prediction-result">
            <h3>Prediction Result</h3>
            <p>
              <strong>Class:</strong> {predictionResult.predicted_class}
            </p>
            <p>
              <strong>Probability:</strong> {predictionResult.probability.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
