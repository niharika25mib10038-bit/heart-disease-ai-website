from pathlib import Path
from typing import Dict, Any

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# 1. APPLICATION SETUP
# ============================================================

app = FastAPI(
    title="Heart Disease AI",
    description="Machine Learning based heart disease prediction API",
    version="1.0.0"
)


# ============================================================
# 2. CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 3. MODEL LOCATION
# ============================================================

# This file must be in the SAME folder as app.py:
#
# backend/
# ├── app.py
# ├── requirements.txt
# └── final_heart_disease_model.pkl

BASE_DIR = Path(__file__).resolve().parent
from pathlib import Path
import joblib

# ============================================================
# 4. LOAD TRAINED ML MODEL
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "final_heart_disease_model.pkl"

model = None

if MODEL_PATH.exists():
    try:
        model = joblib.load(MODEL_PATH)

        print("==========================================")
        print("Heart Disease ML Model Loaded Successfully")
        print("==========================================")

    except Exception as e:
        print("Model loading failed:", e)

else:
    print("Model file not found:", MODEL_PATH)


# ============================================================
# 5. INPUT DATA MODEL
# ============================================================

class PatientInput(BaseModel):

    age: float = Field(
        ...,
        ge=1,
        le=120,
        description="Age in years"
    )

    sex: int = Field(
        ...,
        ge=0,
        le=1,
        description="0 = Female, 1 = Male"
    )

    cp: int = Field(
        ...,
        ge=0,
        le=3,
        description="Chest pain type"
    )

    trestbps: float = Field(
        ...,
        ge=50,
        le=300,
        description="Resting blood pressure"
    )

    chol: float = Field(
        ...,
        ge=50,
        le=700,
        description="Serum cholesterol"
    )

    fbs: int = Field(
        ...,
        ge=0,
        le=1,
        description="Fasting blood sugar"
    )

    restecg: int = Field(
        ...,
        ge=0,
        le=2,
        description="Resting ECG result"
    )

    thalach: float = Field(
        ...,
        ge=50,
        le=250,
        description="Maximum heart rate achieved"
    )

    exang: int = Field(
        ...,
        ge=0,
        le=1,
        description="Exercise induced angina"
    )

    oldpeak: float = Field(
        ...,
        ge=-5,
        le=10,
        description="ST depression induced by exercise"
    )

    slope: int = Field(
        ...,
        ge=0,
        le=2,
        description="Slope of peak exercise ST segment"
    )

    ca: float = Field(
        ...,
        ge=0,
        le=4,
        description="Number of major vessels"
    )

    thal: float = Field(
        ...,
        ge=0,
        le=7,
        description="Thalassemia result"
    )


# ============================================================
# 6. ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Heart Disease AI API is running",
        "documentation": "/docs",
        "health_check": "/api/health"
    }


# ============================================================
# 7. HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_file": MODEL_PATH.name
    }


# ============================================================
# 8. MODEL INFORMATION
# ============================================================

@app.get("/api/model/info")
def model_information():

    return {
        "project": "Heart Disease AI",
        "primary_model": "XGBoost",
        "ensemble": "Soft Voting Ensemble",

        "models": [
            "XGBoost",
            "Logistic Regression",
            "Random Forest",
            "Support Vector Classifier"
        ],

        "dataset": "UCI Cleveland Heart Disease Dataset",

        "validation": "5-Fold Stratified Cross-Validation",

        "explainability": [
            "XGBoost Feature Importance",
            "SHAP"
        ],

        "purpose": "Academic and research demonstration",

        "clinical_status": (
            "Not a clinical diagnostic system"
        )
    }


# ============================================================
# 9. PREDICTION ENDPOINT
# ============================================================

@app.post("/api/predict")
def predict_heart_disease(
    patient: PatientInput
) -> Dict[str, Any]:

    # --------------------------------------------------------
    # Check whether model exists
    # --------------------------------------------------------

    if model is None:

        raise HTTPException(
            status_code=503,
            detail=(
                "ML model is not loaded. "
                "Make sure final_heart_disease_model.pkl "
                "is inside the backend folder."
            )
        )

    # --------------------------------------------------------
    # Convert input into DataFrame
    # --------------------------------------------------------

    patient_data = {
        "age": patient.age,
        "sex": patient.sex,
        "cp": patient.cp,
        "trestbps": patient.trestbps,
        "chol": patient.chol,
        "fbs": patient.fbs,
        "restecg": patient.restecg,
        "thalach": patient.thalach,
        "exang": patient.exang,
        "oldpeak": patient.oldpeak,
        "slope": patient.slope,
        "ca": patient.ca,
        "thal": patient.thal
    }

    input_df = pd.DataFrame([patient_data])

    # --------------------------------------------------------
    # Make prediction
    # --------------------------------------------------------

    try:

        prediction = model.predict(input_df)

        probability = model.predict_proba(input_df)

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )

    # --------------------------------------------------------
    # Extract results
    # --------------------------------------------------------

    predicted_class = int(prediction[0])

    disease_probability = float(
        probability[0][1]
    )

    healthy_probability = float(
        probability[0][0]
    )

    # --------------------------------------------------------
    # Human-readable result
    # --------------------------------------------------------

    if predicted_class == 1:

        result_label = "Heart Disease Predicted"

    else:

        result_label = "No Heart Disease Predicted"

    # --------------------------------------------------------
    # Return result to frontend
    # --------------------------------------------------------

    return {

        "success": True,

        "prediction": predicted_class,

        "label": result_label,

        "heart_disease_probability": round(
            disease_probability,
            4
        ),

        "healthy_probability": round(
            healthy_probability,
            4
        ),

        "heart_disease_percentage": round(
            disease_probability * 100,
            2
        ),

        "healthy_percentage": round(
            healthy_probability * 100,
            2
        ),

        "model": "Soft Voting Ensemble",

        "primary_model": "XGBoost",

        "disclaimer": (
            "This system is an academic/research "
            "demonstration and is NOT a clinical "
            "diagnostic system."
        )
    }


# ============================================================
# 10. RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )