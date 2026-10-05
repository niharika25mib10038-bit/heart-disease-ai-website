# Heart Disease AI — Full Stack Website

This project contains the ML model integration, FastAPI backend, and React/Vite frontend.

## Architecture

React frontend
    ↓
FastAPI REST API
    ↓
Saved scikit-learn/XGBoost pipeline (.pkl)
    ↓
Prediction + probability

## 1. Train the model

Run your research-ready ML script first:

```bash
python heart_disease_ml_v2.py
```

It should create:

```text
outputs/final_heart_disease_model.pkl
```

Copy that file into:

```text
backend/final_heart_disease_model.pkl
```

The website does NOT retrain the model when a user clicks Predict.

## 2. Start the backend

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app:app --reload --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

API health:

```text
http://127.0.0.1:8000/api/health
```

## 3. Start the frontend

Open a SECOND terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## 4. Production deployment

Frontend can be deployed to Vercel.

Backend can be deployed to Render/Railway or another Python hosting service.

Set this frontend environment variable to the deployed backend:

```text
VITE_API_URL=https://YOUR-BACKEND-URL
```

## Important

This is an academic/research demonstration. It is NOT a clinical diagnostic system.

The model is trained on the UCI Cleveland Heart Disease dataset, which is small and should not be treated as evidence of real-world clinical performance.
