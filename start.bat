@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173 --strictPort
) else (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173 --strictPort
)
pause
