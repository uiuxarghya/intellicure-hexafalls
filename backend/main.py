from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.router import api_router
from scalar_fastapi import get_scalar_api_reference
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(
    title="IntelliCure API",
    description="A unified API for various medical models including Brain Tumor classification, Alzheimer's analysis, Pneumonia detection, and Disease prediction.",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get(
    "/raw",
    name="home",
    description="Welcome to the IntelliCure API!",
)
async def raw():
    return {
        "message": "🧠 Welcome to the IntelliCure API!",
        "overview": (
            "This API provides AI-assisted diagnostics for brain tumors, pneumonia, Alzheimer's disease, "
            "and symptom-based illness detection."
        ),
        "available_endpoints": [
            "/tumor/classify - Brain tumor classification from MRI images",
            "/pneumonia/predict - Pneumonia prediction from chest X-ray images",
            "/alzheimers/analyze - Alzheimer's analysis from MRI images",
            "/disease/predict - Disease prediction based on symptoms",
            "/health - Health check endpoint",
        ],
        "tip": "For request formats, supported fields, and model details, visit /docs.",
        "disclaimer": (
            "This API is for educational and experimental use. Predictions should not replace professional medical advice."
        ),
    }


@app.get("/health", summary="Health Check", description="Check if the API is healthy.")
async def health_check():
    return {"status": "healthy"}


@app.get("/docs", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url or "/openapi.json",
        title=app.title,
        hide_models=True,
        hide_download_button=True,
    )


@app.get("/")
async def index():
    return FileResponse("static/index.html")


app.mount("/", StaticFiles(directory="static", html=True), name="static")
