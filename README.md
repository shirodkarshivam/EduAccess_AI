# 🎓 EduAccess AI

> **"Making Education Accessible for Every Student"**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-green.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini%20%7C%20Tesseract.js-blue.svg)](https://deepmind.google/technologies/gemini/)

**EduAccess AI** is an AI-powered educational accessibility web application designed to empower students with disabilities—including hearing impairments, visual impairments, dyslexia, neurodivergence, and language barriers.

By combining Web Speech APIs, **Google Gemini 1.5 Flash Vision AI**, **Tesseract.js OCR**, and **WCAG 2.1 AA** design standards, EduAccess AI breaks down classroom learning barriers into a single, intuitive browser interface.

---

## 🎯 The Problem & Our Solution

### 🔴 The Problem
Over **1 Billion people worldwide** experience disabilities. In conventional educational environments:
- **Deaf / Hard-of-Hearing Students** miss spoken teacher explanations during live lectures.
- **Visually Impaired Students** cannot interpret complex textbook diagrams, science graphs, or illustrations.
- **Dyslexic & Neurodivergent Students** face visual stress, crowding, and reading fatigue from standard typography.
- **Non-Native Speakers** face language barriers when studying complex academic material.

### 🟢 The Solution
**EduAccess AI** unifies 6 powerful accessibility tools into a fast, privacy-focused, zero-install web studio:

---

## 🌟 Key Features

### 1. 🎙️ Live Speech-to-Text (Hearing Support)
- **Real-Time Captions:** Transcribes live teacher lectures and spoken classroom discussions instantly.
- **Target Audience:** Deaf, hard-of-hearing, and auditory processing students.
- **Tech:** Web Speech Recognition API (`webkitSpeechRecognition`).

### 2. 🔊 Smart Text-to-Speech with Sentence Highlighting (Visual & Reading Support)
- **Audio Read-Aloud:** Reads digital notes or imported textbook content with customizable playback speed, pitch, and voice selection.
- **Line-by-Line Highlight:** Synchronizes spoken words with visual highlighting on screen.
- **Target Audience:** Visually impaired students, dyscalculic learners, and auditory learners.

### 3. 👁️ AI Image & Diagram Explainer (Visual Impairment)
- **Multimodal Vision Analysis:** Upload any science diagram, chart, map, or textbook figure.
- **Detailed Audio Explanations:** Generates rich, contextual descriptions of complex visual data for blind students.
- **Tech:** **Google Gemini 1.5 Flash API**.

### 4. 📄 OCR Printed Text Reader (Optical Character Recognition)
- **Text Extraction:** Converts photos of physical textbook pages, handouts, or whiteboards into editable text.
- **One-Click Read & Translate:** Instantly listen to extracted text or translate it.
- **Tech:** **Tesseract.js** (In-browser machine learning execution).

### 5. 📖 Dyslexia & Neurodiversity Reading Mode
- **Atkinson Hyperlegible Font:** Uses Google's specially designed font to maximize character distinction.
- **Visual Comfort Tint:** Warm cream background (`#FDFBF7`) reduces glare and optical fatigue.
- **Customizable Layout:** Controls for font scaling, line height (`1.8`), and letter spacing (`1.2px`).

### 6. 🌐 Multilingual AI Translation
- **8 Supported Languages:** Hindi, Marathi, Gujarati, Spanish, French, German, Japanese, and Arabic.
- **Native Voice Playback:** Speaks translations aloud in authentic native accents.

### ♿ Floating Accessibility Quick Suite (Universal Toolbar)
- 🌓 **Instant Dark / Light Theme Toggle**
- ⚡ **High-Contrast Mode** (Maximum legibility)
- 🔍 **Global Font Scaler** (`-A` / `Normal` / `+A`)
- 🔊 **Screen Reader Simulation Mode**

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6+), CSS3 (Custom CSS Tokens) |
| **Artificial Intelligence** | Google Gemini 1.5 Flash API (Multimodal Vision) |
| **OCR Machine Learning** | Tesseract.js (`v5.x`) |
| **Audio Processing** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **Typography** | Atkinson Hyperlegible, Inter (Google Fonts) |
| **Standards & Compliance** | WCAG 2.1 AA (ARIA Labels, Keyboard Navigation) |

---

## 📁 Project Structure

```
EduAccess_AI/
├── ai eduction 3/
│   ├── index.html            # Main Interactive Web Application
│   ├── try-all-features.html # Live Interactive Feature Showcase & Demo
│   ├── app.js                # Core App Logic, Speech APIs, Gemini & Tesseract Integration
│   ├── styles.css            # Custom CSS Design System, Themes & Accessibility Utilities
│   ├── screenshot.js        # Helper script for capturing UI demos
│   ├── README.md             # Project documentation
│   └── assets/               # Sample diagrams, icons & media assets
├── package.json              # Node.js dependencies
├── .gitignore                # Git exclusions (node_modules, logs, .env)
└── README.md                 # Primary GitHub Repository Readme
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Brave, or Mozilla Firefox).
- An active internet connection for Gemini AI API requests.

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/EduAccess_AI.git
   cd EduAccess_AI
   ```

2. **Open the application:**
   - Double-click `ai eduction 3/index.html` to open it in your browser.
   - OR run a lightweight local dev server:
     ```bash
     npx serve "ai eduction 3"
     ```
   - Open `http://localhost:3000` in your browser.

---

## 💡 How to Demo the Features

1. **Speech-to-Text:** Click `"Start Microphone Demo"` and speak into your mic to see real-time captions.
2. **Text-to-Speech:** Click `"Read Aloud"` on any text block to test real-time sentence tracking.
3. **OCR Reader:** Drag & drop a photo of a book page into the OCR box.
4. **Dyslexia Mode:** Toggle the Dyslexia switch in the top toolbar to see font & tint transitions.
5. **AI Vision:** Upload a science diagram to test Google Gemini's visual explanations.

---

## 🛡️ Privacy & Security
- All OCR processing via Tesseract.js runs **locally in your browser**—your document photos are never stored on external servers.
- Speech recognition utilizes native browser pipelines.

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for details.

---

*Made with ❤️ for educational accessibility and inclusive learning.*
