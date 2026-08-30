@echo off
title Donzen Sales Server
cd /d "%~dp0"
echo ==========================================
echo Starting Donzen Sales & Accounting Server
echo Local URL: http://localhost:3000
echo ==========================================
npm run dev
pause
