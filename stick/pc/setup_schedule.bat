@echo off
cd /d "%~dp0"
schtasks /create /f /tn "ShortsNightlyRender" /tr "\"%~dp0run_queue.bat\"" /sc daily /st 02:07 > schedule_setup.txt 2>&1
schtasks /query /tn "ShortsNightlyRender" /fo LIST >> schedule_setup.txt 2>&1
start "" /min "%~dp0run_queue.bat"
