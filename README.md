# 🚀 StartupIQ – AI & Machine Learning Powered Business Idea Generation & Analysis Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb" />
  <img src="https://img.shields.io/badge/Groq-AI-orange" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Decision%20Tree-success" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>

---

## 📌 Overview

**StartupIQ** is an **AI & Machine Learning powered full-stack business idea generation and analysis platform** designed to help entrepreneurs, students, startups, and innovators transform ideas into actionable business opportunities.

The platform combines **Machine Learning (Decision Tree Algorithm)** with **Groq AI** to generate intelligent business ideas, perform strategic analysis, provide AI-powered recommendations, compare ideas, and deliver personalized business insights through a modern SaaS interface.

---

## 🌐 Live Demo

### 🔗 https://startup-iq-plum.vercel.app/

---

# ✨ Key Features

## 🤖 AI Business Idea Generation

Generate personalized startup ideas based on

- Skills
- Budget
- Interest Area
- Location
- Risk Level
- Experience Level

---

## 🧠 Machine Learning Analysis

Uses the **Decision Tree Algorithm** to analyze business parameters and assist in evaluating startup opportunities.

---

## 💡 Groq AI Integration

Powered by **Groq AI** for

- Business Insights
- Strategic Recommendations
- Startup Guidance
- AI Chatbot
- Business Analysis

---

## 📊 Dashboard Analytics

Interactive dashboard showing

- Total Analyses
- Average Success Rate
- Saved Ideas
- Monthly Trends
- Activity Timeline
- Charts & Graphs

---

## 📈 AI Insights

Provides

- SWOT Analysis
- Market Opportunities
- Risk Assessment
- Growth Strategy
- Future Recommendations
- AI Business Suggestions

---

## ⚖️ Compare Ideas

Compare multiple business ideas using

- Success Score
- Market Demand
- Competition
- Profitability
- AI Recommendations

---

## 💬 AI Chatbot

Interactive chatbot powered by Groq AI for

- Business Questions
- Startup Guidance
- Idea Validation
- Platform Assistance

---

## 📚 Idea Library

Includes

- Saved Ideas
- Idea History
- User Activity
- Personalized Dashboard

---

## 🔐 Secure Authentication

- JWT Authentication
- User Registration
- Login
- Protected Routes
- User Profile

---

## 🌙 Modern UI

- Responsive Design
- Dark Mode
- Glassmorphism UI
- Professional Dashboard
- SaaS Inspired Design

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

---

## Backend

- FastAPI
- Python
- JWT Authentication
- REST APIs

---

## Database

- MongoDB

---

## AI & Machine Learning

- Groq API
- Decision Tree Algorithm

---

## Deployment

Frontend

- Vercel

Backend

- Render

---

# 🏗 System Architecture

```
                React Frontend
                       │
                       ▼
                 Axios API Layer
                       │
                       ▼
                 FastAPI Backend
          ┌────────────┴────────────┐
          ▼                         ▼
 Decision Tree ML              Groq AI
          ▼                         ▼
        Analysis         AI Insights & Chatbot
                └────────────┬────────────┘
                             ▼
                         MongoDB
                             ▼
             Results • Dashboard • Compare
```

---

# ⚙ Workflow

```
User Login / Register
          │
          ▼
Enter Business Preferences
(Skills, Budget, Interest,
Location, Risk, Experience)
          │
          ▼
FastAPI Backend
          │
 ┌────────┴─────────┐
 ▼                  ▼
Decision Tree     Groq AI
Prediction        Analysis
 │                  │
 └────────┬─────────┘
          ▼
      MongoDB
          ▼
Business Results
          │
 ├── Dashboard
 ├── AI Insights
 ├── Compare
 ├── Save
 ├── History
 └── Chatbot
```

---

# 📂 Project Structure

```
StartupIQ
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── assets/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── database/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
└── README.md
```

---

# 🚀 Frontend Setup

## Clone Repository

```bash
https://github.com/Vamshikrishna0372/StartupIQ.git

cd StartupIQ
```

---

## Navigate to Frontend

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

Create

```
.env
```

Add

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production

```env
VITE_API_BASE_URL=https://your-render-url.onrender.com
```

---

## Run Frontend

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🚀 Backend Setup

## Navigate to Backend

```bash
cd backend
```

---

## Create Virtual Environment

Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Requirements

```bash
pip install -r requirements.txt
```

---

## Create Environment File

```
.env
```

```env
MONGODB_URL=your_mongodb_connection

DATABASE_NAME=startupiq

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

GROQ_API_KEY=your_groq_api_key
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 🔌 Main API Endpoints

## Authentication

```
POST /auth/register

POST /auth/login

GET /auth/me
```

---

## Ideas

```
POST /ideas/generate

GET /ideas/history

POST /ideas/save

GET /ideas/saved

DELETE /ideas/saved/{id}
```

---

## Dashboard

```
GET /dashboard/summary

GET /dashboard/trends

GET /dashboard/activity
```

---

## AI

```
POST /chat

POST /insights/analyze
```

---

## Settings

```
GET /settings

PUT /settings
```

---

## Skills

```
POST /skills/suggest
```

---

# 📸 Screenshots

Add screenshots here

```
Dashboard

Generate Page

Results

AI Insights

Compare

Chatbot

Dashboard Analytics
```

---

# 🎯 Future Enhancements

- Investor Recommendation System
- Market Trend Prediction
- Revenue Forecasting
- Pitch Deck Generator
- Business Plan Generator
- Team Collaboration
- Email Notifications
- AI Competitor Analysis
- Cloud Deployment Automation

---

# 👨‍💻 Developer

**Nagula Vamshikrishna**

B.Tech Computer Science & Engineering

AI | Machine Learning | Full Stack Developer

---

# ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork it

📢 Share your feedback

---

# 📄 License

This project is licensed under the MIT License.

---

## 💙 Thank You for Visiting StartupIQ!
