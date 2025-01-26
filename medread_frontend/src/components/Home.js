import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "./AboutUs";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate(); // For navigation

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
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "http://127.0.0.1:5000/predict", true);


      xhr.onload = () => {
        if (xhr.status === 200) {
          setIsUploading(false);

          const response = JSON.parse(xhr.responseText);

          // Convert selected file to a previewable URL
          const uploadedImageURL = URL.createObjectURL(selectedFile);

          // Navigate to the result page
          navigate("/result", { state: { uploadedImage: uploadedImageURL, predictionResult: response } });
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
    <div id="home">
      <div className="hero-section">
        <div className="content-container space-y-5">
          <h1 className="heading">Revolutionizing Medical Report Analysis</h1>
          <p>Experience the seamless reading of your medical reports with MedRead</p>

          <input
          type="file"
          accept=".png, .jpg, .jpeg, .dcm"
          className="file-input"
          id="file-upload"
          onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="custom-file-button">
            Choose Image
          </label>
          
          {selectedFile && <p className="file-name">Selected File: {selectedFile.name}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button onClick={handleUpload} className="button">Upload File</button>

          {/* Progress Bar / Spinner */}
          {isUploading && (
            <div className="progress-container">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>

      {/* About Us Section */}
      <div id="aboutus">
        <AboutUs />
      </div>
    </div>
  );
};

export default Home;
