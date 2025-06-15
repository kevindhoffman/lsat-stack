# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import random

app = FastAPI()

# Allow frontend (Netlify) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your Netlify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load questions from a JSON file
with open("questions.json") as f:
    QUESTIONS = json.load(f)

@app.get("/api/question")
async def get_question():
    if not QUESTIONS:
        raise HTTPException(status_code=404, detail="No questions available")
    return random.choice(QUESTIONS)

@app.post("/api/submit")
async def submit_answer(payload: dict):
    question_id = payload.get("question_id")
    user_answer = payload.get("answer")
    actual_time = payload.get("time_sec")

    question = next((q for q in QUESTIONS if q["question_id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    correct = user_answer == question["correct_answer"]
    ideal_time = question.get("ideal_time_sec", 90)

    try:
        actual_time = float(actual_time)
        efficiency = max(1, min(100, int((ideal_time / actual_time) * 100)))
    except:
        efficiency = 50  # fallback if time data is missing or bad

    feedback = {
        "correct": correct,
        "efficiency": efficiency,
        "explanation": question["explanation"],
        "professors": question["professor_feedback"]
    }

    return JSONResponse(content=feedback)
