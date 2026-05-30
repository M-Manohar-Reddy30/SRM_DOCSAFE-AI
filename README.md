# 🚀 SrmDocSafe AI

### Intelligent Document Management & AI-Powered Knowledge Assistant

SrmDocSafe AI is an advanced AI-powered document intelligence platform that enables users to upload, analyze, summarize, organize, search, and chat with their documents using cutting-edge Artificial Intelligence.

The platform combines OCR, Retrieval-Augmented Generation (RAG), Semantic Search, Vector Embeddings, Document Classification, AI Summarization, and Study Note Generation into a single modern workspace.

---
Demo Video 📹 : https://drive.google.com/file/d/1LdZ9A14OQNY4N5jiosHbGIfzxXr0_TeF/view?usp=sharing

Live URL : https://srm-docsafe-ai.vercel.app/


## 🌟 Features

### 📄 Smart Document Upload

* Upload PDF documents
* Upload scanned documents
* Upload images (PNG, JPG, JPEG)
* Automatic file validation
* Duplicate file detection
* Secure storage

---

### 🔍 OCR Text Extraction

Automatically extracts text from:

* Scanned PDFs
* Images
* Handwritten documents (basic support)
* Printed documents

Powered by OCR technology for maximum accessibility.

---

### 🧠 AI Document Classification

Automatically categorizes uploaded documents into:

* Resume
* Certificate
* Marksheet
* Assignment
* Research Paper
* Notes
* Circular
* Project Report
* Unknown

---

### ✨ AI Summarization

Generates:

#### Short Summary

Quick overview of the document.

#### Detailed Summary

Comprehensive explanation of document contents.

#### Key Points

Important bullet-point highlights.

---

### 📝 AI Study Notes Generator

Automatically creates:

* Exam Notes
* Revision Notes
* Key Concepts

Perfect for students and learners.

---

### 🏷 AI Tag Generation

Automatically extracts meaningful tags for:

* Better organization
* Faster search
* Semantic grouping

---

### 📅 Deadline Extraction

Detects:

* Submission dates
* Deadlines
* Important schedules
* Event dates

from uploaded documents.

---

### 🤖 AI Chat With Documents

Users can ask questions like:

> What is this document about?

> Summarize chapter 3.

> What are the important deadlines?

> Explain this topic in simple language.

The AI answers using information from uploaded documents.

---

### 🔎 Semantic Search

Uses vector embeddings and Retrieval-Augmented Generation (RAG) to:

* Understand document meaning
* Retrieve relevant chunks
* Provide context-aware answers

---

### 📊 Analytics Dashboard

Track:

* Total documents
* Ready documents
* Processing documents
* Failed documents
* Storage usage
* AI-generated notes
* AI-generated tags
* Chat statistics

---

### 🔐 Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* User-specific documents
* Secure API access

---

## 🏗 System Architecture

User Upload

↓

OCR Processing

↓

Document Classification

↓

AI Summary Generation

↓

Study Notes Generation

↓

Tag Extraction

↓

Deadline Extraction

↓

Text Chunking

↓

Vector Embedding

↓

Semantic Search

↓

AI Chat Assistant

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
* React Hot Toast
* Lucide React
* Chart.js

---

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL
* JWT Authentication
* Pydantic

---

### Artificial Intelligence

* Groq API
* Llama 3.3 70B
* Retrieval-Augmented Generation (RAG)
* Semantic Search
* OCR Processing

---

### Database

* PostgreSQL

---

### Vector Search

* ChromaDB

---

## 📂 Project Structure

backend/

├── app/

│ ├── api/

│ ├── core/

│ ├── db/

│ ├── models/

│ ├── services/

│ └── main.py

frontend/

├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ └── App.jsx

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/M-Manohar-Reddy30/SrmDocSafe-AI.git

cd SrmDocSafe-AI
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create .env file:

```env
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

GROQ_API_KEY=your_groq_api_key

ALGORITHM=HS256
```

Run Backend:

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📈 Future Enhancements

* AI Quiz Generation
* AI Flashcards
* Multi-Language Support
* Voice Assistant
* Team Collaboration
* Cloud Storage Integration
* Mobile Application
* AI Resume Analyzer
* AI Interview Preparation

---

## 🎯 Use Cases

### Students

* Study smarter
* Generate notes instantly
* Extract important concepts

### Researchers

* Summarize papers
* Organize research documents

### Professionals

* Analyze reports
* Search company documents

### Educational Institutions

* Centralized AI document management

---

## 👨‍💻 Developer

### Manohar Reddy M

B.Tech CSE (AI & ML)

Full Stack & AI Developer

GitHub:
https://github.com/M-Manohar-Reddy30

LinkedIn:
https://www.linkedin.com/in/manoharreddy-ai

---

## ⭐ Support

If you like this project:

⭐ Star the repository

🍴 Fork the repository

📢 Share with others

---

## 📜 License

This project is licensed under the MIT License.

---

### Built with ❤️ using AI, FastAPI, React, PostgreSQL, ChromaDB and Groq.
