"""
FastAPI server entry point.
Run from the server/ directory:
    python run.py
Or directly:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""
import os
import sys

# Ensure working directory is server/
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn

if __name__ == "__main__":
    print("=" * 55)
    print("  Jagdamba Fisheries — FastAPI Backend")
    print("  http://localhost:8000")
    print("  API Docs: http://localhost:8000/docs")
    print("=" * 55)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
