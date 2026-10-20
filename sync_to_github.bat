@echo off
title Uzhavan Hub - 1-Click Sync to GitHub
color 0A

echo ========================================================
echo   Uzhavan Hub - Sync Changes to GitHub ^& Live Website
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking changed files...
git status -s

echo.
echo [2/3] Staging and committing changes...
git add .

set "commit_msg="
set /p commit_msg="Enter update description (or press Enter for default): "
if "%commit_msg%"=="" set "commit_msg=Update Uzhavan Hub features and datasets [%date% %time%]"

git commit -m "%commit_msg%"

echo.
echo [3/3] Pushing updates to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All changes are pushed to GitHub.
    echo   GitHub Pages will update your live website in ~60s!
    echo ========================================================
) else (
    echo.
    echo [!] Notice: Git push failed. Please verify your internet connection or GitHub credentials.
)

echo.
pause
