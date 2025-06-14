from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import os
from datetime import datetime

router = APIRouter()
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(file.file.read())
    return JSONResponse({"filename": filename, "status": "uploaded"})
