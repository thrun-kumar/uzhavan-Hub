@echo off
title Uzhavan Hub - Your Digital Farming Companion
color 0A
echo =================================================================
echo        UZHAVAN HUB - YOUR DIGITAL FARMING COMPANION
echo        AI-Powered Agriculture Decision Support System
echo =================================================================
echo.
echo Starting local Python web server on http://localhost:8000 ...
echo.

cd /d "%~dp0"
start "" http://localhost:8000
py server.py

pause
