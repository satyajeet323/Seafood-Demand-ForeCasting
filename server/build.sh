#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

echo "🔍 Checking Python version..."
python --version

echo "📦 Upgrading pip and build tools..."
python -m pip install --upgrade pip setuptools wheel

echo "📥 Installing dependencies..."
pip install --no-cache-dir -r requirements.txt

echo "📁 Creating necessary directories..."
mkdir -p data/processed
mkdir -p models/saved_models
mkdir -p results

echo "✅ Build completed successfully!"
