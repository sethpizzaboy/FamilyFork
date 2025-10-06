@echo off
echo Starting Family Fork...
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not running.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is available. Starting services...
echo.

REM Start all services
docker-compose up -d

REM Wait a moment for services to start
timeout /t 5 /nobreak >nul

REM Check service status
echo.
echo Checking service status...
docker-compose ps

echo.
echo Family Fork is starting up!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause >nul

