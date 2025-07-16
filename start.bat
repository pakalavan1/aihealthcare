@echo off
echo Starting AI Healthcare Prediction System...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 14 or higher
    pause
    exit /b 1
)

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

REM Train models
echo Training machine learning models...
cd backend
python train_models.py
if errorlevel 1 (
    echo Error: Failed to train models
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

REM Start backend server
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

REM Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening application in browser...
start http://localhost:3000

echo.
echo AI Healthcare Prediction System is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul 