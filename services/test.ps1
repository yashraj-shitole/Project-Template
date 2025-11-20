# Quick connectivity test for services
# Usage: run from repo root or services folder: `cd services; .\test.ps1`

function Test-Url($url) {
    for ($i = 0; $i -lt 12; $i++) {
        try {
            $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            Write-Host "$url -> $($res.StatusCode)"
            return $true
        } catch {
            Write-Host "$url -> unavailable, retrying..."
            Start-Sleep -Seconds 2
        }
    }
    Write-Host "$url -> FAILED after retries"
    return $false
}

$root = (Get-Location).Path
Write-Host "Testing services from $root"

$backend = 'http://localhost:3000/health'
$frontend = 'http://localhost:4200/'

$ok1 = Test-Url $backend
$ok2 = Test-Url $frontend

if ($ok1 -and $ok2) {
    Write-Host "All services reachable."
    exit 0
} else {
    Write-Host "One or more services are unreachable."
    exit 1
}
