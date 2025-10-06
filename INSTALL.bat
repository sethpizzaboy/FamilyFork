@echo off
echo ========================================
echo   Family Fork Enterprise - Quick Install
echo ========================================
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
echo   Installation Complete!
echo ========================================
echo.
echo ✓ Family Fork Enterprise is now running
echo ✓ Open your browser and go to: http://localhost:3000
echo ✓ Professional meal planning app ready to use!
echo.
echo Features available:
echo - Professional Enterprise UI
echo - Smart meal planning with AI
echo - Inventory management with barcode scanning
echo - Recipe collection with dietary filtering
echo - Family profiles with dietary restrictions
echo - Grocery lists with smart organization
echo - Bug tracking system with email notifications
echo - Mobile app ready for Android sideloading
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Enjoy your professional meal planning experience!
pause
