import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the state passed via navigation
  const { uploadedImage, predictionResult } = location.state || {};

  if (!uploadedImage || !predictionResult) {
    return (
      <div className="result-page">
        <h2>No prediction data available</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <h1>Prediction Results</h1>

      <div className="uploaded-image">
        <h3>Uploaded Image</h3>
        <img src={uploadedImage} alt="Uploaded File" className="image-preview" />
      </div>

      <div className="prediction-details">
        <h3>Prediction Details</h3>
        {predictionResult.type === "CT scan" ? (
          <>
            <p>
              <strong>Type:</strong> CT Scan
            </p>
            <p>
              <strong>Class:</strong> {predictionResult.predicted_class}
            </p>
            <p>
              <strong>Probability:</strong> {predictionResult.probability.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Type:</strong> Text Report
            </p>
            <p>
              <strong>Extracted Text:</strong> {predictionResult.extracted_text}
            </p>
            <p>
              <strong>Predicted Class:</strong> {predictionResult.predicted_class}
            </p>
          </>
        )}
      </div>

      <div className="button-container">
        <button className="upload-button" onClick={() => navigate("/")}>Upload Another File</button>

        <button
          className="download-button"
          onClick={() => {
            if (predictionResult.type === "CT scan") {
              const queryParams = new URLSearchParams({
                uploaded_image: uploadedImage,
                type: predictionResult.type,
                predicted_class: predictionResult.predicted_class,
                probability: predictionResult.probability,
              }).toString();
              window.open(`http://localhost:5000/download_report?${queryParams}`, "_blank");
            } else {
              const queryParams = new URLSearchParams({
                type: predictionResult.type,
                predicted_class: predictionResult.predicted_class,
                extracted_text: predictionResult.extracted_text,
              }).toString();

              window.open(`http://localhost:5000/download_report?${queryParams}`, "_blank");
            }
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;
