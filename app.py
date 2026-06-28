import os
import sys
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uvicorn import run as app_run
from typing import Dict

from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.pipeline.training_pipeline import TrainingPipeline
from networksecurity.utils.main_utils.utils import load_object
from networksecurity.utils.ml_utils.model.estimator import NetworkModel


app = FastAPI(title="SecureNet AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # okay for development and EC2 testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREPROCESSOR_PATH = "final_model/preprocessor.pkl"
MODEL_PATH = "final_model/model.pkl"

FEATURE_COLUMNS = [
    "having_IP_Address",
    "URL_Length",
    "Shortining_Service",
    "having_At_Symbol",
    "double_slash_redirecting",
    "Prefix_Suffix",
    "having_Sub_Domain",
    "SSLfinal_State",
    "Domain_registeration_length",
    "Favicon",
    "port",
    "HTTPS_token",
    "Request_URL",
    "URL_of_Anchor",
    "Links_in_tags",
    "SFH",
    "Submitting_to_email",
    "Abnormal_URL",
    "Redirect",
    "on_mouseover",
    "RightClick",
    "popUpWidnow",
    "Iframe",
    "age_of_domain",
    "DNSRecord",
    "web_traffic",
    "Page_Rank",
    "Google_Index",
    "Links_pointing_to_page",
    "Statistical_report"
]


def load_network_model():
    preprocessor = load_object(PREPROCESSOR_PATH)
    model = load_object(MODEL_PATH)
    return NetworkModel(preprocessor=preprocessor, model=model)


try:
    network_model = load_network_model()
    print("Model loaded successfully")
except Exception as e:
    network_model = None
    print(f"Model loading failed: {e}")


class PredictionInput(BaseModel):
    features: Dict[str, float]


@app.get("/")
def home():
    return {
        "message": "SecureNet AI Backend is running",
        "docs": "/docs",
        "model_loaded": network_model is not None
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": network_model is not None
    }


@app.get("/train")
def train_route():
    try:
        train_pipeline = TrainingPipeline()
        train_pipeline.run_pipeline()

        global network_model
        network_model = load_network_model()

        return {
            "message": "Training completed successfully",
            "model_reloaded": True
        }

    except Exception as e:
        raise NetworkSecurityException(e, sys)


@app.post("/predict")
def predict(data: PredictionInput):
    try:
        if network_model is None:
            raise HTTPException(
                status_code=500,
                detail="Model is not loaded. Please train the model first or check final_model files."
            )

        input_dict = data.features

        missing_columns = [col for col in FEATURE_COLUMNS if col not in input_dict]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required features: {missing_columns}"
            )

        input_df = pd.DataFrame([input_dict])
        input_df = input_df[FEATURE_COLUMNS]

        prediction = network_model.predict(input_df)[0]

        prediction_text = "Phishing" if int(prediction) == 1 else "Legitimate"

        confidence = calculate_confidence(input_df)

        risk_score = (
            confidence
            if prediction_text == "Phishing"
            else round(100 - confidence, 2)
        )

        reasons = generate_reasons(data)

        recommendations = generate_recommendations(prediction_text)

        return {
            "prediction": prediction_text,
            "confidence": confidence,
            "risk_score": risk_score,
            "reasons": reasons,
            "recommendations": recommendations
        }

    except HTTPException:
        raise

    except Exception as e:
        raise NetworkSecurityException(e, sys)


def calculate_confidence(input_df: pd.DataFrame) -> float:
    try:
        transformed_data = network_model.preprocessor.transform(input_df)
        probability = network_model.model.predict_proba(transformed_data)[0]
        return round(float(np.max(probability)) * 100, 2)

    except Exception:
        return 90.0


def generate_reasons(data: PredictionInput):
    features = data.features
    reasons = []

    if features.get("URL_Length") == -1:
        reasons.append("URL length appears unusually long.")

    if features.get("having_IP_Address") == -1:
        reasons.append("The URL uses an IP address instead of a domain name.")

    if features.get("Prefix_Suffix") == -1:
        reasons.append("The URL contains a suspicious prefix or suffix.")

    if features.get("SSLfinal_State") == -1:
        reasons.append("SSL certificate state appears suspicious or invalid.")

    if features.get("DNSRecord") == -1:
        reasons.append("DNS record information looks suspicious.")

    if features.get("Google_Index") == -1:
        reasons.append("Website may not be indexed by Google.")

    if features.get("Shortining_Service") == -1:
        reasons.append("The URL appears to use a shortening service.")

    if features.get("web_traffic") == -1:
        reasons.append("Website has low or suspicious traffic signals.")

    if not reasons:
        reasons.append("The model analyzed the website features and found no major suspicious pattern.")

    return reasons


def generate_recommendations(prediction_text: str):
    if prediction_text == "Phishing":
        return [
            "Do not enter passwords or personal information.",
            "Avoid downloading files from this website.",
            "Do not make payments on this website.",
            "Verify the domain manually before trusting it."
        ]

    return [
        "Website appears safe based on the provided features.",
        "Still verify the URL before entering sensitive information.",
        "Keep browser security protections enabled."
    ]


if __name__ == "__main__":
    app_run(app, host="0.0.0.0", port=8000)