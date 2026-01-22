# Import required libraries

import numpy as np                          # For numerical operations
import tensorflow as tf                     # For deep learning model handling (TensorFlow/Keras)
import cv2                                  # For image preprocessing (OpenCV)

from flask import Flask, request, jsonify, send_file  # Flask for creating web API
from flask_cors import CORS                           # To handle Cross-Origin Resource Sharing (CORS) issues

from tensorflow.keras.models import load_model        # For loading pre-trained Keras models
from tensorflow.keras.preprocessing import image      # For image preprocessing utilities

import pytesseract                         # For Optical Character Recognition (OCR) on text from images
import joblib                              # For loading serialized models (like sklearn models)
import tempfile                            # To create temporary files
import os                                  # For file path and OS-level operations
import matplotlib.pyplot as plt            # For plotting and visualization
import logging                             # For logging and debugging

from lime.lime_text import LimeTextExplainer     # LIME explainer for text data
from lime.lime_image import LimeImageExplainer   # LIME explainer for image data

from reportlab.lib.pagesizes import letter                 # For setting PDF page size
from reportlab.platypus import Paragraph, SimpleDocTemplate, Image, Spacer  # For PDF report generation
from reportlab.lib.styles import getSampleStyleSheet       # For text styling in PDF

from skimage.segmentation import mark_boundaries           # To highlight image regions (used with LIME explanations)


app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ct_scan_model = load_model("lung_cancer_detection_model.h5")
text_classifier = joblib.load("lung_cancer_classifier.pkl")
tfidf_vectorizer = joblib.load("tfidf_vectorizer.pkl")
logger.info("Models loaded successfully")

# Custom function for adding bold and space in titles
def bold_title_style():
    styles = getSampleStyleSheet()
    bold_style = styles["Heading2"]
    bold_style.fontName = "Helvetica-Bold"
    return bold_style

#Reads CT scan images, resizes them to 256x256, normalizes pixel values to [0,1], and converts them into an array 
#format suitable for model input.
def preprocess_ct_scan(img_path):
    img = image.load_img(img_path, target_size=(256, 256))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0) / 255.0
    return img

def preprocess_ct_scan2(img_path):
    img = image.load_img(img_path, target_size=(256, 256))
    img = image.img_to_array(img)
    img = img / 255.0
    return img

#Uses pytesseract to check if an image contains text or is a CT scan.
def detect_ct_or_text(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    text = pytesseract.image_to_string(img).strip()
    return "text" if text else "ct"

#Reads a medical report image and extracts the text using OCR (Tesseract).
def extract_text(img_path):
    img = cv2.imread(img_path)
    return pytesseract.image_to_string(img).strip()

#Converts extracted text into TF-IDF vectors for classification.
def preprocess_text(text):
    return tfidf_vectorizer.transform([text])

#Uses LIME to explain the classifier's predictions by showing important words influencing the decision.
def explain_lime(text):
    explainer = LimeTextExplainer(class_names=list(text_classifier.classes_))
    exp = explainer.explain_instance(text, lambda x: text_classifier.predict_proba(tfidf_vectorizer.transform(x)), num_features=10, num_samples=500)
    return exp.as_list()

def generate_pdf(output_path, report_type, predicted_class, probability=None, extracted_text=None, lime_explanation=None, img_path=None, lime_img_path=None):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("<b>Lung Cancer Detection Report</b>", styles["Title"]))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Type: {report_type}", bold_title_style()))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(f"Predicted Class: {predicted_class}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    if report_type == "CT scan":
        elements.append(Paragraph(f"Prediction Probability: {probability:.4f}", styles["Normal"]))
        elements.append(Spacer(1, 6))
        if lime_img_path:
            elements.append(Paragraph("LIME Explanation (CT Scan):", bold_title_style()))
            elements.append(Spacer(1, 6))
            elements.append(Image(lime_img_path, width=200, height=200))
    else:
        elements.append(Paragraph("Extracted Text:", bold_title_style()))
        elements.append(Spacer(1, 6))
        elements.append(Paragraph(extracted_text, styles["Normal"]))
        elements.append(Spacer(1, 12))
        
        elements.append(Paragraph("LIME Explanation:", bold_title_style()))
        elements.append(Spacer(1, 6))
        for word, weight in lime_explanation:
            elements.append(Paragraph(f"{word}: {weight:.4f}", styles["Normal"]))
            elements.append(Spacer(1, 6))

    doc.build(elements)
    return output_path

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    try:
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            file.save(temp_file.name)
            img_path = temp_file.name

        image_type = detect_ct_or_text(img_path)
        pdf_path = os.path.join(tempfile.gettempdir(), "report.pdf")

        if image_type == "ct":
            img = preprocess_ct_scan(img_path)
            img2 = preprocess_ct_scan2(img_path)
            prediction = ct_scan_model.predict(img)
            predicted_class = np.argmax(prediction, axis=1)[0]
            class_labels = ['Benign', 'Malignant', 'Normal']
            probability = float(np.max(prediction))
            
            # Generate LIME explanation
            explainer = LimeImageExplainer()
            explanation = explainer.explain_instance(
                img2.astype('double'),  # Convert to double precision
                ct_scan_model.predict,
                top_labels=5,
                hide_color=0,
                num_samples=1000
            )

            # Extract the explanation image and mask
            temp, mask = explanation.get_image_and_mask(
                explanation.top_labels[0], 
                positive_only=True, 
                num_features=10, 
                hide_rest=False
            )

            # Convert the explanation into a properly visualized image
            explanation_image = mark_boundaries(temp, mask)

            # Save the LIME explanation image
            lime_output_path = os.path.join(tempfile.gettempdir(), "lime_explanation.jpg")
            plt.imsave(lime_output_path, explanation_image)


            generate_pdf(pdf_path, "CT scan", class_labels[predicted_class], probability=probability, lime_img_path=lime_output_path)
            return jsonify({"status": "success", "type": "CT scan", "predicted_class": class_labels[predicted_class], "probability": probability, "pdf_report": "/download_report"}), 200
        else:
            extracted_text = extract_text(img_path)
            processed_text = preprocess_text(extracted_text)
            text_prediction = text_classifier.predict(processed_text)[0]
            lime_explanation = explain_lime(extracted_text)
            generate_pdf(pdf_path, "Text report", text_prediction, extracted_text=extracted_text, lime_explanation=lime_explanation)
            return jsonify({"status": "success", "type": "Text report", "extracted_text": extracted_text, "predicted_class": text_prediction, "lime_explanation": lime_explanation, "pdf_report": "/download_report"}), 200
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if os.path.exists(img_path):
            os.remove(img_path)

@app.route('/download_report', methods=['GET'])
def download_report():
    pdf_path = os.path.join(tempfile.gettempdir(), "report.pdf")
    if os.path.exists(pdf_path):
        return send_file(pdf_path, as_attachment=True)
    return jsonify({"status": "error", "message": "Report not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 