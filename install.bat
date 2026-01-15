@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to install dependencies
    echo Please run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    echo Then run this script again
    pause
    exit /b %errorlevel%
)

echo.
echo Dependencies installed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
pause
