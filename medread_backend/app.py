from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import tempfile
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model 
model_path = r"E:\medread-fyp\medread_backend\lung_cancer_detection_model.h5" 
model = load_model(model_path)
logger.info("Model loaded successfully.")

# Preprocess the image before prediction
def preprocess_image(img_path):
    target_size = (256, 256)  # Update based on model.input_shape
    img = image.load_img(img_path, target_size=target_size)  # Resize image
    img = image.img_to_array(img)  # Convert image to array
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = img / 255.0  # Normalize pixel values
    return img

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    try:
        # Temporarily save the uploaded image
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            img_path = temp_file.name

        # Preprocess the image and make predictions
        img = preprocess_image(img_path)
        prediction = model.predict(img)
        predicted_class = np.argmax(prediction, axis=1)[0]
        class_labels = ['Bengin cases', 'Malignant cases', 'Normal cases']

        logger.info(f"Prediction: {class_labels[predicted_class]}, Probability: {np.max(prediction)}")

        return jsonify({
            "status": "success",
            "predicted_class": class_labels[predicted_class],
            "probability": float(np.max(prediction))
        }), 200

    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        # Clean up temporary file
        if os.path.exists(img_path):
            os.remove(img_path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)