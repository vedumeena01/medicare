@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo    MediExplain AI - Evaluator Quick Verification
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js v18 or higher from https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Node.js environment detected:
node -v
echo.

echo [2/3] Running Unified Multi-Tier CI Pipeline (TypeScript + 69 Tests + Turbopack Build)...
echo.
call npm run ci

if %ERRORLEVEL% neq 0 (
    echo.
    echo ======================================================
    echo  [FAIL] Verification checks encountered an error.
    echo ======================================================
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================
echo  [SUCCESS] All 69 health tests and builds passed 100%%!
echo  Platform is ready for presentation and deployment.
echo ======================================================
echo.
pause
