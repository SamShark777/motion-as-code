@echo off
cd /d "%~dp0"
set PATH=%PATH%;C:\Users\Shadow\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build-shared\bin
"..\ComfyUI_windows_portable\python_embeded\python.exe" run_queue.py 4 >> queue_log.txt 2>&1
