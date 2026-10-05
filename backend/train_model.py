import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

from xgboost import XGBClassifier


# ============================================================
# 1. DOWNLOAD HEART DISEASE DATASET
# ============================================================
url = "https://raw.githubusercontent.com/campusx-official/100-days-of-machine-learning/main/day68-stacking-and-blending/heart.csv"

df = pd.read_csv(url)

print("Dataset loaded successfully.")
print("Shape:", df.shape)
print(df.head())


# ============================================================
# 2. CONVERT DATASET TO THE FEATURES USED BY OUR WEBSITE
# ============================================================

# This Plotly dataset uses:
# age, sex, cp, trestbps, chol, fbs, restecg,
# thalach, exang, oldpeak, slope, ca, thal, target

features = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]

X = df[features].copy()
y = df["target"].copy()


# ============================================================
# 3. MAKE SURE TARGET IS BINARY
# ============================================================

# 0 = no heart disease
# 1 = heart disease

y = y.astype(int)


# ============================================================
# 4. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# 5. CREATE FOUR MACHINE LEARNING MODELS
# ============================================================

logistic_model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=2000))
])


random_forest_model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("model", RandomForestClassifier(
        n_estimators=300,
        random_state=42
    ))
])


svc_model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", SVC(
        probability=True,
        random_state=42
    ))
])


xgboost_model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("model", XGBClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        eval_metric="logloss",
        random_state=42
    ))
])


# ============================================================
# 6. SOFT VOTING ENSEMBLE
# ============================================================

ensemble = VotingClassifier(
    estimators=[
        ("logistic_regression", logistic_model),
        ("random_forest", random_forest_model),
        ("svc", svc_model),
        ("xgboost", xgboost_model)
    ],
    voting="soft"
)


# ============================================================
# 7. TRAIN
# ============================================================

print("\nTraining models...")

ensemble.fit(X_train, y_train)


# ============================================================
# 8. TEST MODEL
# ============================================================

predictions = ensemble.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n========================================")
print("MODEL TRAINING COMPLETE")
print("========================================")
print("Test Accuracy:", round(accuracy * 100, 2), "%")


# ============================================================
# 9. SAVE MODEL
# ============================================================
model_path = "backend/final_heart_disease_model.pkl"

joblib.dump(ensemble, model_path)

print("\nModel saved as:")
print(model_path)

print("\nDone!")