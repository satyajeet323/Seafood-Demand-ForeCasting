# Dockerfile — run from the project root:
#   docker build -f server/Dockerfile -t seafood-server .
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server source code
COPY server/ ./server/

# Set working directory to server so all relative paths resolve correctly
WORKDIR /app/server

# Create necessary directories
RUN mkdir -p logs data/processed data/raw models/saved_models results

# Expose port for FastAPI (8000)
EXPOSE 8000

# Health check for FastAPI
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command: run FastAPI from server/
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
