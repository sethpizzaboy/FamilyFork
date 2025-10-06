#!/bin/bash

echo "Starting Family Fork..."
echo

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not running."
    echo "Please install Docker and try again."
    exit 1
fi

echo "Docker is available. Starting services..."
echo

# Start all services
docker-compose up -d

# Wait a moment for services to start
sleep 5

# Check service status
echo
echo "Checking service status..."
docker-compose ps

echo
echo "Family Fork is starting up!"
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo
echo "Press any key to continue..."
read -n 1

