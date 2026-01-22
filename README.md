# MedRead – AI-Powered Medical Report Analysis System 

## Final Year Project (FYP)

**MedRead** is an intelligent medical report analysis and decision-support system designed to assist healthcare professionals in interpreting **lung cancer–related medical reports**.
The system integrates **Natural Language Processing (NLP)**, **Deep Learning (CNNs)**, and **Explainable Artificial Intelligence (XAI)** to automate report reading while maintaining transparency and trust.

---

## Problem Statement

Medical reports often contain **unstructured text and medical images**, making manual analysis:

* Time-consuming
* Prone to human error
* Difficult to scale

Existing AI solutions lack:

* Multimodal integration (text + images)
* Explainability required for clinical trust
* Robustness across formats and data sources

---

## Project Objectives

* Automatically **read and analyze medical reports**
* Extract **key diagnostic insights** from text and images
* Provide **explainable AI outputs** for clinicians
* Improve **efficiency, accuracy, and consistency**

---

##  Core Features

* **Medical Report Text Analysis**
  * NLP-based preprocessing and information extraction
    
* **Medical Image Processing**
  * CNN-based feature extraction from radiology images
  * 
* **Multimodal Data Fusion**
  * Combines text and image representations
    
* **Explainable AI (XAI)**
  * Interpretable predictions and reasoning

---

## 🏗 System Architecture

```
FYP-main/
│
├── backend/
│   └── app.js
│
├── ml/
│   ├── nlp/                # Text preprocessing & embeddings
│   ├── cnn/                # Image classification models
│
├── frontend/
│   ├── pages/              # User interfaces
│   ├── components/
│   └── assets/
│
├── README.md
```

---

## Technologies Used

### Programming & Frameworks

* Python
* React (UI)

### AI & Machine Learning
* Natural Language Processing (NLP)
* Convolutional Neural Networks (CNN)
* Multimodal Learning
* Explainable AI (XAI)

### Data & Tools
* Medical text reports
* Radiology images
* Git & GitHub

---

## Installation & Setup

### 1️Clone the Repository

```bash
git clone https://github.com/your-username/FYP-main.git
cd FYP-main
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

### 3️⃣ ML Environment

```bash
pip install -r requirements.txt
```

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Research & Evaluation

* Dataset preprocessing and normalization
* Performance metrics:

  * Accuracy
  * Precision
  * Recall
  * F1-scor``

---

## Explainable AI (XAI)

The system integrates **XAI techniques** to:

* Highlight influential features
* Explain prediction reasoning

---

## Future Enhancements

* Extend diagnosis beyond lung cancer
* Integration with **EHR / PACS systems**
* Cloud-based scalable deployment
* Real-time clinical decision support
* Continuous learning from clinician feedback

---

## Author

**Denith Pramuditha**
Final Year Undergraduate – Software Engineering
Focus Areas: AI in Healthcare, NLP, Deep Learning, XAI

---

