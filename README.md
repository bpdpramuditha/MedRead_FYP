# MedRead – AI-Powered Medical Report Analysis System

## Final Year Project (FYP)

**MedRead** is an intelligent medical report analysis and decision-support system designed to assist healthcare professionals in interpreting **lung cancer–related medical reports**.
The system integrates **Natural Language Processing (NLP)**, **Deep Learning (CNNs)**, and **Explainable Artificial Intelligence (XAI)** to automate medical report analysis while maintaining transparency and trust.

---

## Problem Statement

Medical reports often contain **unstructured text and medical images**, making manual analysis:

* Time-consuming
* Prone to human error
* Difficult to scale

Existing AI-based solutions lack:

* Effective multimodal integration (text + images)
* Explainability required for clinical trust
* Robustness across different report formats and data sources

---

## Project Objectives

* Automatically **read and analyze medical reports**
* Extract **key diagnostic insights** from text and images
* Provide **explainable AI outputs** for clinicians
* Improve **efficiency, accuracy, and consistency** in diagnosis support

---

## Core Features

* **Medical Report Text Analysis**

  * NLP-based preprocessing and information extraction

* **Medical Image Processing**

  * CNN-based feature extraction from radiology images

* **Multimodal Data Fusion**

  * Combines text-based and image-based representations

* **Explainable AI (XAI)**

  * Interpretable predictions with reasoning support

---

## System Architecture

```
FYP-main/
│
├── backend/
│   └── app.js
│
├── ml/
│   ├── nlp/                # Text preprocessing and embeddings
│   ├── cnn/                # Image classification models
│
├── frontend/
│   ├── pages/              # User interfaces
│   ├── components/
│   └── assets/
│
└── README.md
```

---

## Technologies Used

### Programming & Frameworks

* Python
* React

### AI & Machine Learning

* Natural Language Processing (NLP)
* Convolutional Neural Networks (CNN)
* Multimodal Learning
* Explainable Artificial Intelligence (XAI)

### Data & Tools

* Medical text reports
* Radiology images
* Git and GitHub

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FYP-main.git
cd FYP-main
```

---

## Python Virtual Environment (venv)

This project uses a **Python virtual environment (`venv`)** to manage dependencies and ensure reproducibility.

### 2. Create the Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Deactivate the Environment

```bash
deactivate
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## .gitignore Configuration

Ensure the following entries are included in your `.gitignore` file:

```gitignore
# Python virtual environment
venv/

# Python cache files
__pycache__/
*.pyc
```
## Model Download and Setup

Due to GitHub file size limitations, the trained deep learning model is **not included in this repository**.

### Download the Model

* **Download from:**
 https://drive.google.com/drive/folders/1knDnYbPJbqAOQ-u7alaB_Idj0j_TSo9l?usp=drive_link

### Local Placement

After downloading, place the model file in the following directory:

```
medread_backend/
```

### Expected Filename

```
lung_cancer_detection_model.h5
```

### Notes

* Ensure the filename matches exactly, as the backend loads the model using this path.
* The model file is excluded from version control and listed in `.gitignore`.
* This approach keeps the repository lightweight while ensuring reproducibility.

---

**Example (Python model loading):**

```python
model = load_model("medread_backend/lung_cancer_detection_model.h5")
```

---

## Research & Evaluation

* Dataset preprocessing and normalization
* Performance evaluation using:

  * Accuracy
  * Precision
  * Recall
  * F1-score

---

## Explainable AI (XAI)

The system integrates XAI techniques to:

* Highlight influential features used in predictions
* Explain model reasoning to support clinical decision-making

---

## Future Enhancements

* Extend diagnosis beyond lung cancer
* Integration with EHR and PACS systems
* Cloud-based scalable deployment
* Real-time clinical decision support
* Continuous learning from clinician feedback

---

## Author

**Denith Pramuditha**
Final Year Undergraduate – Software Engineering
Focus Areas: AI in Healthcare, NLP, Deep Learning, Explainable AI

---
