$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if (-not (Test-Path ".venv\Scripts\python.exe")) {
  & ".\setup.ps1"
}

& ".\.venv\Scripts\pyinstaller.exe" `
  --noconfirm `
  --clean `
  --windowed `
  --name "GreenzoArticleEditor" `
  ".\app.py"

Write-Host "Build completed: $scriptDir\dist\GreenzoArticleEditor\GreenzoArticleEditor.exe"
