@echo off
echo ========================================
echo   Family Fork Enterprise - Complete Setup
echo ========================================
echo.

echo Choose your setup option:
echo 1. Web App (Docker) - Full features, 5-10 minutes
echo 2. Mobile App (APK) - Quick install, 2 minutes
echo 3. Both - Web app + Mobile APK
echo.

set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto webapp
if "%choice%"=="2" goto mobile
if "%choice%"=="3" goto both
echo Invalid choice. Please run the script again.
pause
exit /b 1

:webapp
echo.
echo [1/4] Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not installed or not running.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo Then restart this script.
    pause
    exit /b 1
)
echo ✓ Docker is installed and running

echo.
echo [2/4] Starting Family Fork Enterprise...
echo This may take 2-3 minutes on first run...
echo.

docker-compose up --build -d

echo.
echo [3/4] Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Checking service status...
docker-compose ps

echo.
echo ========================================
echo   Web App Installation Complete!
echo ========================================
echo.
echo ✓ Family Fork Enterprise is now running
echo ✓ Open your browser and go to: http://localhost:3000
echo ✓ Professional meal planning app ready to use!
echo.
echo Press any key to open the application...
pause >nul
start http://localhost:3000
goto end

:mobile
echo.
echo Building Family Fork Mobile APK...
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
goto end

:both
echo.
echo Setting up both Web App and Mobile APK...
echo.
call :webapp
echo.
echo Now building mobile APK...
call :mobile
goto end

:end
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your friend now has access to:
echo - Professional meal planning application
echo - Smart AI-powered meal suggestions
echo - Barcode scanning for inventory
echo - Family dietary management
echo - Automated grocery lists
echo - Mobile app for phone/tablet use
echo.
echo This will save him hours every week on meal planning!
echo.
pause
