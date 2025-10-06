@echo off
echo Family Fork Network Status Checker
echo ====================================
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found

REM Remove leading spaces
set LOCAL_IP=%LOCAL_IP: =%

echo Local IP Address: %LOCAL_IP%
echo.

echo Checking Docker services...
docker-compose -f docker-compose.network.yml ps
echo.

echo Testing connectivity...
echo.

echo Testing Frontend (Port 3000):
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3000 2>nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is accessible locally
) else (
    echo ✗ Frontend is not accessible locally
)

echo.
echo Testing Backend API (Port 8000):
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/health 2>nul
if %errorlevel% equ 0 (
    echo ✓ Backend API is accessible locally
) else (
    echo ✗ Backend API is not accessible locally
)

echo.
echo ====================================
echo Network Access Information:
echo ====================================
echo.
echo From other devices on your WiFi:
echo   Frontend: http://%LOCAL_IP%:3000
echo   Backend API: http://%LOCAL_IP%:8000
echo   API Documentation: http://%LOCAL_IP%:8000/docs
echo.
echo Mobile/Tablet Setup:
echo   1. Connect to the same WiFi as this computer
echo   2. Open browser and go to: http://%LOCAL_IP%:3000
echo   3. Bookmark the address for easy access
echo.
echo ====================================
echo.
echo Press any key to continue...
pause >nul
