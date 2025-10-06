#!/bin/bash

echo "Building Family Fork Debug APK for Sideloading..."
echo

echo "Step 1: Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "Step 2: Building React app..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build React app"
    exit 1
fi

echo
echo "Step 3: Syncing with Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to sync with Capacitor"
    exit 1
fi

echo
echo "Step 4: Building Debug APK..."
npx cap run android --no-sync
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build debug APK"
    echo "Trying alternative method..."
    npx cap build android
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to build APK"
        exit 1
    fi
fi

echo
echo "✅ Debug APK build completed!"
echo
echo "APK Location: android/app/build/outputs/apk/debug/app-debug.apk"
echo
echo "Next steps for installation:"
echo "1. Enable Developer Options on Pixel phone"
echo "2. Enable USB Debugging"
echo "3. Connect phone via USB"
echo "4. Run: adb install app-debug.apk"
echo
echo "Or copy the APK to the phone and install manually!"
echo
