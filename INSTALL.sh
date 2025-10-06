#!/bin/bash

echo "========================================"
echo "  Family Fork Enterprise - Quick Install"
echo "========================================"
echo

echo "[1/4] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed."
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    echo "Then restart this script."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running."
    echo "Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is installed and running"

echo
echo "[2/4] Starting Family Fork Enterprise..."
echo "This may take 2-3 minutes on first run..."
echo

docker-compose up --build -d

echo
echo "[3/4] Waiting for services to start..."
sleep 10

echo
echo "[4/4] Checking service status..."
docker-compose ps

echo
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo
echo "✓ Family Fork Enterprise is now running"
echo "✓ Open your browser and go to: http://localhost:3000"
echo "✓ Professional meal planning app ready to use!"
echo
echo "Features available:"
echo "- Professional Enterprise UI"
echo "- Smart meal planning with AI"
echo "- Inventory management with barcode scanning"
echo "- Recipe collection with dietary filtering"
echo "- Family profiles with dietary restrictions"
echo "- Grocery lists with smart organization"
echo "- Bug tracking system with email notifications"
echo "- Mobile app ready for Android sideloading"
echo

# Try to open browser (works on macOS and some Linux distros)
if command -v open &> /dev/null; then
    echo "Opening application in browser..."
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    echo "Opening application in browser..."
    xdg-open http://localhost:3000
else
    echo "Please open your browser and go to: http://localhost:3000"
fi

echo
echo "Enjoy your professional meal planning experience!"
