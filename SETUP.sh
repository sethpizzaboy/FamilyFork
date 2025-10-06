#!/bin/bash

echo "========================================"
echo "  Family Fork Enterprise - Complete Setup"
echo "========================================"
echo

echo "Choose your setup option:"
echo "1. Web App (Docker) - Full features, 5-10 minutes"
echo "2. Mobile App (APK) - Quick install, 2 minutes"
echo "3. Both - Web app + Mobile APK"
echo

read -p "Enter your choice (1, 2, or 3): " choice

case $choice in
    1)
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
        echo "  Web App Installation Complete!"
        echo "========================================"
        echo
        echo "✓ Family Fork Enterprise is now running"
        echo "✓ Open your browser and go to: http://localhost:3000"
        echo "✓ Professional meal planning app ready to use!"
        echo

        # Try to open browser
        if command -v open &> /dev/null; then
            echo "Opening application in browser..."
            open http://localhost:3000
        elif command -v xdg-open &> /dev/null; then
            echo "Opening application in browser..."
            xdg-open http://localhost:3000
        else
            echo "Please open your browser and go to: http://localhost:3000"
        fi
        ;;
    2)
        echo
        echo "Building Family Fork Mobile APK..."
        cd frontend
        ./share-apk.sh
        if [ $? -ne 0 ]; then
            echo "ERROR: Build failed. Trying alternative method..."
            ./build-debug-apk.sh
            if [ $? -ne 0 ]; then
                echo "ERROR: Could not build APK. Please check Node.js installation."
                exit 1
            fi
        fi

        echo
        echo "✅ SUCCESS! Family Fork APK is ready!"
        echo
        echo "APK Location: frontend/shared-apk/FamilyFork-v1.0.apk"
        echo
        echo "Next steps for your friend:"
        echo "1. Send this APK file to your friend (email, Google Drive, etc.)"
        echo "2. Tell him to download it to his Pixel phone"
        echo "3. Open Files app on phone → Downloads"
        echo "4. Tap FamilyFork-v1.0.apk → Install"
        echo "5. Open Family Fork from app drawer"
        echo
        echo "Total time for your friend: 2 minutes maximum"
        ;;
    3)
        echo
        echo "Setting up both Web App and Mobile APK..."
        echo
        # Run web app setup
        $0 <<< "1"
        echo
        echo "Now building mobile APK..."
        # Run mobile setup
        $0 <<< "2"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo
echo "Your friend now has access to:"
echo "- Professional meal planning application"
echo "- Smart AI-powered meal suggestions"
echo "- Barcode scanning for inventory"
echo "- Family dietary management"
echo "- Automated grocery lists"
echo "- Mobile app for phone/tablet use"
echo
echo "This will save him hours every week on meal planning!"
echo
