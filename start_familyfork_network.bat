@echo off
echo Starting Family Fork for Network Access...
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found

REM Remove leading spaces
set LOCAL_IP=%LOCAL_IP: =%

echo Detected local IP address: %LOCAL_IP%
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not running.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is available. Starting services for network access...
echo.

REM Create environment file with network IP
echo REACT_APP_BACKEND_URL=http://%LOCAL_IP%:8000 > .env.network

REM Start services with network configuration
docker-compose -f docker-compose.network.yml up -d

REM Wait a moment for services to start
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo Checking service status...
docker-compose -f docker-compose.network.yml ps

echo.
echo ========================================
echo Family Fork is now accessible from:
echo ========================================
echo.
echo Local Access:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo.
echo Network Access (from other devices):
echo   Frontend: http://%LOCAL_IP%:3000
echo   Backend API: http://%LOCAL_IP%:8000
echo.
echo Mobile/Tablet Access:
echo   Connect to the same WiFi network as this computer
echo   Open browser and go to: http://%LOCAL_IP%:3000
echo.
echo API Documentation: http://%LOCAL_IP%:8000/docs
echo.
echo ========================================
echo.
echo Press any key to continue...
pause >nul
