import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the state passed via navigation
  const { uploadedImage, predictionResult } = location.state || {};

  if (!uploadedImage || !predictionResult) {
    return (
      <div>
        <h2>No prediction data available</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <h1>Prediction Results</h1>

      {/* Display uploaded image */}
      <div className="uploaded-image">
        <h3>Uploaded Image</h3>
        <img src={uploadedImage} alt="Uploaded CT Scan" className="image-preview" />
      </div>

      {/* Display prediction results */}
      <div className="prediction-details">
        <h3>Prediction Details</h3>
        <p>
          <strong>Class:</strong> {predictionResult.predicted_class}
        </p>
        <p>
          <strong>Probability:</strong> {predictionResult.probability.toFixed(2)}
        </p>
      </div>

      <button onClick={() => navigate("/")}>Upload Another File</button>
    </div>
  );
};

export default PredictionResult;
