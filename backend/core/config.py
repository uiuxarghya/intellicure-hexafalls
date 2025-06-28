# app/core/config.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY) # type: ignore
    GEMINI_MODEL = genai.GenerativeModel("gemini-2.5-flash") # type: ignore
else:
    raise ValueError("Missing GEMINI_API_KEY in .env file")