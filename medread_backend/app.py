from flask import Flask, request, jsonify, send_file
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
import lime
from lime.lime_text import LimeTextExplainer
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Image

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models
ct_scan_model = load_model("lung_cancer_detection_model.h5")
text_classifier = joblib.load("lung_cancer_classifier.pkl")
tfidf_vectorizer = joblib.load("tfidf_vectorizer.pkl")
logger.info("Models loaded successfully")

# Preprocess CT scan
def preprocess_ct_scan(img_path):
    img = image.load_img(img_path, target_size=(256, 256))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0) / 255.0
    return img

# Detect whether the image is a CT scan or Text
def detect_ct_or_text(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    text = pytesseract.image_to_string(img).strip()
    return "text" if text else "ct"

# Extract text from image
def extract_text(img_path):
    img = cv2.imread(img_path)
    return pytesseract.image_to_string(img).strip()

# Preprocess text
def preprocess_text(text):
    return tfidf_vectorizer.transform([text])

# Explain using LIME
def explain_lime(text):
    explainer = LimeTextExplainer(class_names=list(text_classifier.classes_))
    exp = explainer.explain_instance(text, 
                                     lambda x: text_classifier.predict_proba(tfidf_vectorizer.transform(x)), 
                                     num_features=10, num_samples=500)
    return exp.as_list()

# Generate PDF report for both CT and Text Reports
def generate_pdf(output_path, report_type, predicted_class, probability=None, extracted_text=None, lime_explanation=None, img_path=None):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    highlight_style = ParagraphStyle("highlight", parent=styles["BodyText"], textColor=colors.red)
    elements = []

    elements.append(Paragraph("<b>Lung Cancer Detection Report</b>", styles["Title"]))
    elements.append(Paragraph(f"Type: {report_type}", styles["Normal"]))
    elements.append(Paragraph(f"Predicted Class: {predicted_class}", styles["Normal"]))

    if img_path and os.path.exists(img_path):
        elements.append(Paragraph("Uploaded Image:", styles["Normal"]))
        img = Image(img_path, width=200, height=200)
        elements.append(img)

    if report_type == "CT scan":
        elements.append(Paragraph(f"Prediction Probability: {probability:.4f}", styles["Normal"]))
    else:
        elements.append(Paragraph("Extracted Text:", styles["Normal"]))
        highlighted_text = extracted_text
        for word, _ in lime_explanation:
            highlighted_text = highlighted_text.replace(word, f'<font color="red">{word}</font>')
        elements.append(Paragraph(highlighted_text, styles["Normal"]))

        elements.append(Paragraph("LIME Explanation:", styles["Normal"]))
        for word, weight in lime_explanation:
            elements.append(Paragraph(f"{word}: {weight:.4f}", highlight_style))

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
            prediction = ct_scan_model.predict(img)
            predicted_class = np.argmax(prediction, axis=1)[0]
            class_labels = ['Benign', 'Malignant', 'Normal']
            probability = float(np.max(prediction))

            generate_pdf(pdf_path, "CT scan", class_labels[predicted_class], probability=probability, img_path=img_path)

            return jsonify({
                "status": "success",
                "type": "CT scan",
                "predicted_class": class_labels[predicted_class],
                "probability": probability,
                "pdf_report": "/download_report"
            }), 200
        else:
            extracted_text = extract_text(img_path)
            processed_text = preprocess_text(extracted_text)
            text_prediction = text_classifier.predict(processed_text)[0]
            lime_explanation = explain_lime(extracted_text)

            generate_pdf(pdf_path, "Text report", text_prediction, extracted_text=extracted_text, lime_explanation=lime_explanation, img_path=img_path)

            return jsonify({
                "status": "success",
                "type": "Text report",
                "extracted_text": extracted_text,
                "predicted_class": text_prediction,
                "lime_explanation": lime_explanation,
                "pdf_report": "/download_report"
            }), 200

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
