@echo off
title PlaceReady Campus Placement Portal
cd /d "%~dp0"
echo ========================================================
echo   Starting PlaceReady Campus Placement Portal...
echo ========================================================
start http://localhost:5173
npm run dev
pause
