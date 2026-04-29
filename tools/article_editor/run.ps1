$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if (-not (Test-Path ".venv\Scripts\python.exe")) {
  Write-Host "Virtual environment not found, running setup first..."
  & ".\setup.ps1"
}

& ".\.venv\Scripts\python.exe" ".\app.py"
