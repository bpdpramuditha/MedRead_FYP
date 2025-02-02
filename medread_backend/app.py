from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import cv2
import pytesseract
import joblib
import numpy as np
import tempfile
import os
import logging
import traceback

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the CT scan model
ct_scan_model_path = r"E:\medread-fyp\medread_backend\lung_cancer_detection_model.h5"
ct_scan_model = load_model(ct_scan_model_path)

# Load the text models
text_classifier_path = r"E:\medread-fyp\medread_backend\lung_cancer_classifier.pkl"
tfidf_vectorizer_path = r"E:\medread-fyp\medread_backend\tfidf_vectorizer.pkl"

text_classifier = joblib.load(text_classifier_path)
tfidf_vectorizer = joblib.load(tfidf_vectorizer_path)

logger.info("All models loaded successfully.")

# Preprocess the CT scan image before prediction
def preprocess_ct_scan(img_path):
    try:
        target_size = (256, 256)
        img = image.load_img(img_path, target_size=target_size)
        img = image.img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = img / 255.0
        return img
    except Exception as e:
        logger.error(f"Error preprocessing CT scan: {e}")
        raise ValueError("Invalid or corrupted image file.")

# Detect if the image is a CT scan or a text-based report
def detect_ct_or_text(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    text_detected = pytesseract.image_to_string(img).strip()
    return "text" if text_detected else "ct"

# Extract text from a radiology text report image
def extract_text(img_path):
    img = cv2.imread(img_path)
    text = pytesseract.image_to_string(img)
    return text.strip()

# Preprocess text using the TF-IDF vectorizer
def preprocess_text(text):
    return tfidf_vectorizer.transform([text])

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    # Validate file size (10MB limit)
    max_file_size = 10 * 1024 * 1024
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    if file_size > max_file_size:
        return jsonify({"status": "error", "message": "File size exceeds 10MB limit"}), 400

    try:
        # Temporarily save the uploaded image
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            img_path = temp_file.name

        # Determine if the image is a CT scan or a text report
        image_type = detect_ct_or_text(img_path)

        if image_type == "ct":
            logger.info("CT scan detected.")
            img = preprocess_ct_scan(img_path)
            prediction = ct_scan_model.predict(img)
            predicted_class = np.argmax(prediction, axis=1)[0]
            class_labels = ['Benign cases', 'Malignant cases', 'Normal cases']

            logger.info(f"CT scan prediction: {class_labels[predicted_class]}, Probability: {np.max(prediction)}")

            return jsonify({
                "status": "success",
                "type": "CT scan",
                "predicted_class": class_labels[predicted_class],
                "probability": float(np.max(prediction))
            }), 200
        else:
            logger.info("Text report detected.")
            extracted_text = extract_text(img_path)
            processed_text = preprocess_text(extracted_text)
            text_prediction = text_classifier.predict(processed_text)
            text_predicted_class = text_prediction[0]

            logger.info(f"Text prediction: {text_predicted_class}")

            return jsonify({
                "status": "success",
                "type": "Text report",
                "extracted_text": extracted_text,
                "predicted_class": text_predicted_class
            }), 200

    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        # Clean up the temporary file
        if os.path.exists(img_path):
            os.remove(img_path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)