@echo off
echo Family Fork - Emergency Quick Setup
echo ===================================
echo.
echo This will create a ready-to-use APK in under 2 minutes.
echo Perfect for your friend's situation.
echo.

echo Step 1: Building Family Fork APK...
cd frontend
call share-apk.bat
if %errorlevel% neq 0 (
    echo ERROR: Build failed. Trying alternative method...
    call build-debug-apk.bat
    if %errorlevel% neq 0 (
        echo ERROR: Could not build APK. Please check Node.js installation.
        pause
        exit /b 1
    )
)

echo.
echo ✅ SUCCESS! Family Fork APK is ready!
echo.
echo APK Location: frontend\shared-apk\FamilyFork-v1.0.apk
echo.
echo Next steps for your friend:
echo 1. Send this APK file to your friend (email, Google Drive, etc.)
echo 2. Tell him to download it to his Pixel phone
echo 3. Open Files app on phone → Downloads
echo 4. Tap FamilyFork-v1.0.apk → Install
echo 5. Open Family Fork from app drawer
echo.
echo Total time for your friend: 2 minutes maximum
echo.
echo The app includes:
echo - Meal planning for multiple diets
echo - Barcode scanning for inventory
echo - Family member management
echo - Grocery list generation
echo - Recipe search and management
echo.
echo This will save him hours every week on meal planning!
echo.
pause
