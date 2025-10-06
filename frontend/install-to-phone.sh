#!/bin/bash

echo "Family Fork - Easy Phone Installation"
echo "===================================="
echo

echo "This script will build and install Family Fork on your connected Android phone."
echo

echo "Prerequisites:"
echo "- Android phone connected via USB"
echo "- USB Debugging enabled on phone"
echo "- ADB installed on computer"
echo

read -p "Press Enter to continue..."

echo "Step 1: Building Family Fork APK..."
./build-debug-apk.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build APK"
    exit 1
fi

echo
echo "Step 2: Checking for connected devices..."
adb devices
if [ $? -ne 0 ]; then
    echo "ERROR: ADB not found. Please install Android SDK Platform Tools"
    echo "Download from: https://developer.android.com/studio/releases/platform-tools"
    exit 1
fi

echo
echo "Step 3: Installing Family Fork on phone..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install APK"
    echo "Make sure:"
    echo "- Phone is connected via USB"
    echo "- USB Debugging is enabled"
    echo "- You allowed USB Debugging on the phone"
    exit 1
fi

echo
echo "✅ Family Fork installed successfully!"
echo
echo "The app should now appear on your phone's app drawer."
echo "You can open it and start using all the meal planning features!"
echo
echo "Features available:"
echo "- Barcode scanning for inventory"
echo "- Meal planning for multiple diets"
echo "- Family member management"
echo "- Recipe search and management"
echo "- Grocery list generation"
echo

