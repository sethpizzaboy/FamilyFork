#!/bin/bash

echo "Family Fork Network Status Checker"
echo "===================================="
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

echo "Local IP Address: $LOCAL_IP"
echo

echo "Checking Docker services..."
docker-compose -f docker-compose.network.yml ps
echo

echo "Testing connectivity..."
echo

echo "Testing Frontend (Port 3000):"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✓ Frontend is accessible locally"
else
    echo "✗ Frontend is not accessible locally"
fi

echo
echo "Testing Backend API (Port 8000):"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health | grep -q "200"; then
    echo "✓ Backend API is accessible locally"
else
    echo "✗ Backend API is not accessible locally"
fi

echo
echo "===================================="
echo "Network Access Information:"
echo "===================================="
echo
echo "From other devices on your WiFi:"
echo "  Frontend: http://$LOCAL_IP:3000"
echo "  Backend API: http://$LOCAL_IP:8000"
echo "  API Documentation: http://$LOCAL_IP:8000/docs"
echo
echo "Mobile/Tablet Setup:"
echo "  1. Connect to the same WiFi as this computer"
echo "  2. Open browser and go to: http://$LOCAL_IP:3000"
echo "  3. Bookmark the address for easy access"
echo
echo "===================================="
echo
echo "Press any key to continue..."
read -n 1

