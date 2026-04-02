# StartupIQ - Run Instructions

This guide provides the necessary steps to set up and run the StartupIQ full-stack application.

## 🔷 Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB instance (Local or Atlas)
- Groq API Key (for AI features)

---

## 🔷 1. Backend Setup

### Navigation
```bash
cd StartupIQ_backend
```

### Installation
```bash
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the `StartupIQ_backend` folder:
```env
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secret_key_for_jwt
```

### Running the Server
```bash
uvicorn app.main:app --reload
```
The backend will be available at: `http://127.0.0.1:8000`

---

## 🔷 2. Frontend Setup

### Navigation
```bash
cd StartupIQ_frontend
```

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev
```
The app will be available at: `http://localhost:8080` (or `8081` etc., check console)

---

## 🔷 3. Core Features
- **Dashboard**: Real-time business metrics and activity tracking.
- **Generate**: AI-powered business idea generation and analysis.
- **Saved Ideas**: Persistent library of bookmarked concepts.
- **Advisory Chat**: Intelligent startup guidance via Groq AI.
- **Profile & Settings**: Full user account management and personalization.

## 🔷 Troubleshooting
- Ensure MongoDB is running and reachable via the `MONGO_URI`.
- If the frontend fails to connect, check that the backend is running on port 8000.
- Verify `GROQ_API_KEY` is valid for idea generation features.
