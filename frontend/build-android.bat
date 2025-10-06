@echo off
echo Building Family Fork Android App...
echo.

echo Step 1: Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)

echo.
echo Step 3: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Failed to sync with Capacitor
    pause
    exit /b 1
)

echo.
echo Step 4: Opening Android Studio...
call npx cap open android
if %errorlevel% neq 0 (
    echo ERROR: Failed to open Android Studio
    echo Please make sure Android Studio is installed
    pause
    exit /b 1
)

echo.
echo ✅ Build process completed successfully!
echo.
echo Next steps:
echo 1. In Android Studio, go to Build → Generate Signed Bundle/APK
echo 2. Choose Android App Bundle (AAB) for Play Store
echo 3. Create or use existing keystore for signing
echo 4. Build the release version
echo 5. Upload to Google Play Console
echo.
pause
