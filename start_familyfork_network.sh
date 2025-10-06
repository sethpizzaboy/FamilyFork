#!/bin/bash

echo "Starting Family Fork for Network Access..."
echo

# Get the local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Alternative method if hostname -I doesn't work
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ip route get 1.1.1.1 | awk '{print $7; exit}')
fi

# Another alternative for macOS
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
fi

echo "Detected local IP address: $LOCAL_IP"
echo

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not running."
    echo "Please install Docker and try again."
    exit 1
fi

echo "Docker is available. Starting services for network access..."
echo

# Create environment file with network IP
echo "REACT_APP_BACKEND_URL=http://$LOCAL_IP:8000" > .env.network

# Start services with network configuration
docker-compose -f docker-compose.network.yml up -d

# Wait a moment for services to start
sleep 10

# Check service status
echo
echo "Checking service status..."
docker-compose -f docker-compose.network.yml ps

echo
echo "========================================"
echo "Family Fork is now accessible from:"
echo "========================================"
echo
echo "Local Access:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo
echo "Network Access (from other devices):"
echo "  Frontend: http://$LOCAL_IP:3000"
echo "  Backend API: http://$LOCAL_IP:8000"
echo
echo "Mobile/Tablet Access:"
echo "  Connect to the same WiFi network as this computer"
echo "  Open browser and go to: http://$LOCAL_IP:3000"
echo
echo "API Documentation: http://$LOCAL_IP:8000/docs"
echo
echo "========================================"
echo
echo "Press any key to continue..."
read -n 1


