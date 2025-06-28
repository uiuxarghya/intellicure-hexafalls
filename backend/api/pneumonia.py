# app/api/pneumonia.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from core.utils import preprocess_image_pil, generate_gemini_insights
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as T
import os
from typing import Tuple
from PIL import Image
from huggingface_hub import hf_hub_download

router = APIRouter()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
class_names = ["NORMAL", "PNEUMONIA"]

transform = T.Compose(
    [
        T.Resize((256, 256)),
        T.CenterCrop(224),
        T.ToTensor(),
        T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)

model_path = hf_hub_download(
    repo_id="uiuxarghya/test-store",
    filename="models/pneumonia.pt",
    repo_type="dataset"
)

def load_model(model_path: str) -> nn.Module:
    model = models.vgg19(pretrained=False)
    in_features = (
        model.classifier[0].in_features
        if isinstance(model.classifier[0], nn.Linear)
        else 25088
    )
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 4096),  # type: ignore
        nn.ReLU(inplace=True),
        nn.Dropout(0.5),
        nn.Linear(4096, 4096),
        nn.ReLU(inplace=True),
        nn.Dropout(0.5),
        nn.Linear(4096, 2),
        nn.LogSoftmax(dim=1),
    )
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device).eval()
    return model


model = load_model(model_path)

def predict(image: Image.Image) -> Tuple[str, float]:
    tensor_image: torch.Tensor = transform(image)  # type: ignore
    input_tensor = tensor_image.unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.exp(output)
        confidence, predicted_idx = torch.max(probs, dim=1)
        return class_names[predicted_idx.item()], float(confidence.item())  # type: ignore


@router.post(
    "/predict",
    name="shwaas_veda",
    description="Predict pneumonia from chest X-ray images",
)
async def classify_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = preprocess_image_pil(contents)
        label, confidence = predict(image)
        analysis = await generate_gemini_insights(
            label, {label: confidence}, mode="pneumonia"
        )
        return {
            "prediction": label,
            "confidence": round(confidence, 4),
            "gemini_analysis": analysis,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
