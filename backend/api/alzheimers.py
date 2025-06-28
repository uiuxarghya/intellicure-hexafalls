# app/api/alzheimers.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from core.utils import preprocess_image_tf, generate_gemini_insights
from functools import lru_cache
import numpy as np
import tensorflow as tf
import os
from huggingface_hub import hf_hub_download

router = APIRouter()

CLASS_LABELS = [
    "Mild Dementia",
    "Moderate Dementia",
    "Non Demented",
    "Very Mild Dementia",
]


@lru_cache(maxsize=1)
def load_model():
    model_path = hf_hub_download(
        repo_id="uiuxarghya/test-store",
        filename="models/alzheimers.h5",
        repo_type="dataset"
    )
    return tf.keras.models.load_model(model_path)  # type: ignore


@router.post(
    "/analyze", name="smritiyaan", description="Analyze Alzheimer's from MRI images"
)
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPG/PNG supported.")

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large. Max size 5MB.")

    input_tensor = preprocess_image_tf(contents)
    model = load_model()
    predictions = model.predict(input_tensor)
    confidences = predictions[0].tolist()
    predicted_class = CLASS_LABELS[np.argmax(confidences)]
    confidence_dict = {
        label: float(conf) for label, conf in zip(CLASS_LABELS, confidences)
    }

    insights = await generate_gemini_insights(
        predicted_class, confidence_dict, mode="alzheimers"
    )
    return {
        "predictedClass": predicted_class,
        "confidences": confidence_dict,
        "insights": insights,
    }