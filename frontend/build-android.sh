#!/bin/bash

echo "Building Family Fork Android App..."
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
echo "Step 4: Opening Android Studio..."
npx cap open android
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to open Android Studio"
    echo "Please make sure Android Studio is installed"
    exit 1
fi

echo
echo "✅ Build process completed successfully!"
echo
echo "Next steps:"
echo "1. In Android Studio, go to Build → Generate Signed Bundle/APK"
echo "2. Choose Android App Bundle (AAB) for Play Store"
echo "3. Create or use existing keystore for signing"
echo "4. Build the release version"
echo "5. Upload to Google Play Console"
echo

