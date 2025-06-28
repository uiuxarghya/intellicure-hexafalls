# app/core/utils.py
import numpy as np
import tensorflow as tf
import io
from PIL import Image
from .config import GEMINI_MODEL


def preprocess_image_tf(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img) # type: ignore
    return np.expand_dims(img_array / 255.0, axis=0)


def preprocess_image_pil(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return img


async def generate_gemini_insights(label, confidences, mode="general"):
    confidence = confidences[label] * 100

    if mode == "tumor":
        prompt = f"""
        You are a medical assistant. Generate a tumor analysis report for diagnosis **{label}** with confidence {confidence:.1f}%.
        Include:
        - Description
        - Common MRI findings
        - Recommended medical steps
        - Lifestyle/care suggestions
        Avoid markdown or HTML.
        """
    elif mode == "alzheimers":
        prompt = f"""
        Generate Alzheimer’s medical report for type '{label}' with {confidence:.1f}% confidence.
        Explain:
        - Symptoms
        - MRI observations
        - Next steps
        - Care strategies

        Format the output strictly using Markdown. Output only the following sections and nothing else. No introduction, no headings, no extra markdown syntax beyond what is shown below. Use this exact format:

        ## Symptoms
        [description]

        ## MRI observations
        [description]

        ## Next steps
        [description]

        ## Care strategies
        [description]
        """
    elif mode == "pneumonia":
        prompt = f"""
        Explain in layman terms the medical condition '{label}' with {confidence:.1f}% confidence.
        Focus on:
        - What it is
        - Symptoms
        - What the patient should do
        Format in markdown.
        """
    else:
        prompt = f"Explain medical condition '{label}' with {confidence:.1f}% confidence."

    response = await GEMINI_MODEL.generate_content_async(prompt)
    return response.text
