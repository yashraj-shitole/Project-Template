<#
Simple helper to install frontend dependencies from the `services` folder.
Run from `services` folder or repo root: `.	ools\install-frontend.ps1` or `cd services; .\install-frontend.ps1`
#>
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
# assume repo structure: services is sibling to frontend
$frontendPath = Join-Path $scriptRoot "..\frontend"
Write-Host "Installing frontend dependencies in: $frontendPath"
if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    try {
        npm install
    } catch {
        Write-Error "npm install failed: $_"
        exit 1
    } finally {
        Pop-Location
    }
    Write-Host "Frontend dependencies installed."
    exit 0
} else {
    Write-Error "Frontend folder not found at $frontendPath"
    exit 2
}
