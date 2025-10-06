@echo off
echo Building Family Fork Debug APK for Sideloading...
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
echo Step 4: Building Debug APK...
call npx cap run android --no-sync
if %errorlevel% neq 0 (
    echo ERROR: Failed to build debug APK
    echo Trying alternative method...
    call npx cap build android
    if %errorlevel% neq 0 (
        echo ERROR: Failed to build APK
        pause
        exit /b 1
    )
)

echo.
echo ✅ Debug APK build completed!
echo.
echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Next steps for installation:
echo 1. Enable Developer Options on Pixel phone
echo 2. Enable USB Debugging
echo 3. Connect phone via USB
echo 4. Run: adb install app-debug.apk
echo.
echo Or copy the APK to the phone and install manually!
echo.
pause

