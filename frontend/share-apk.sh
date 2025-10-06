#!/bin/bash

echo "Family Fork - APK Sharing Setup"
echo "=============================="
echo

echo "This script will build the APK and prepare it for sharing."
echo

echo "Step 1: Building Family Fork APK..."
./build-debug-apk.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build APK"
    exit 1
fi

echo
echo "Step 2: Copying APK to shared folder..."
mkdir -p shared-apk
cp android/app/build/outputs/apk/debug/app-debug.apk shared-apk/FamilyFork-v1.0.apk

echo
echo "✅ APK ready for sharing!"
echo
echo "APK Location: shared-apk/FamilyFork-v1.0.apk"
echo
echo "Sharing options:"
echo "1. Email the APK file to your friend"
echo "2. Upload to Google Drive and share link"
echo "3. Use USB cable to copy to phone"
echo "4. Use cloud storage (Dropbox, OneDrive, etc.)"
echo
echo "Installation instructions for your friend:"
echo "1. Download the APK file to their Pixel phone"
echo "2. Open File Manager on the phone"
echo "3. Navigate to Downloads folder"
echo "4. Tap the FamilyFork-v1.0.apk file"
echo "5. Allow installation from unknown sources if prompted"
echo "6. Tap Install"
echo "7. Open Family Fork from app drawer!"
echo
