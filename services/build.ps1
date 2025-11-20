<#
build.ps1 - Build and optionally bring up Docker Compose services for this project.

Usage examples:
  # Build only (auto-detect .env)
  .\build.ps1

  # Build and bring services up in detached mode
  .\build.ps1 -Up

  # Build without cache and pull latest images
  .\build.ps1 -NoCache -Pull

  # Specify a custom env file path (relative to the services folder)
  .\build.ps1 -EnvFile ".env"
#>

param(
    [string]
    $EnvFile = ".env",

    [switch]
    $NoCache,

    [switch]
    $Pull,

    [switch]
    $Up,

    [switch]
    $Detach,

    [switch]
    $Help
)

if ($Help) {
    Get-Help -Full -ErrorAction SilentlyContinue
    Write-Host "\nCustom usage:\n  .\build.ps1 [-EnvFile <path>] [-NoCache] [-Pull] [-Up] [-Detach:$true|$false]"
    exit 0
}

$ErrorActionPreference = 'Stop'

# Ensure Detach defaults to $true unless explicitly provided on the command line.
if (-not $PSBoundParameters.ContainsKey('Detach')) {
    $Detach = $true
}

# Resolve script and compose file paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$composeFile = Join-Path $scriptDir 'docker-compose.yml'

if (-not (Test-Path $composeFile)) {
    Write-Error "docker-compose.yml not found in '$scriptDir'. Run this script from the 'services' folder."
    exit 1
}

# Try several locations for the env file and pick the first existing one.
$envCandidates = @(
    (Join-Path $scriptDir $EnvFile),
    (Join-Path (Join-Path $scriptDir '..') $EnvFile),
    (Join-Path $scriptDir '.env')
) | Get-Unique

$envFilePath = $null
foreach ($candidate in $envCandidates) {
    if (Test-Path $candidate) {
        # prefer the first existing candidate
        $envFilePath = (Resolve-Path -Path $candidate).ProviderPath
        break
    }
}

if (-not $envFilePath) {
    Write-Host "No .env file found in common locations. Continuing without --env-file." -ForegroundColor Yellow
# close the env-file else and continue
} else {
    Write-Host "Using env file: $envFilePath"
}
# Build base args (compose file + optional env-file)
$baseArgs = @('-f', $composeFile)
if ($envFilePath) { $baseArgs += @('--env-file', $envFilePath) }

function Run-Compose {
    param([string[]] $subArgs)
    # If any --progress global flag was passed in subArgs, extract it and place immediately after 'compose'
    $progressArgs = @()
    $filteredSubArgs = @()
    foreach ($a in $subArgs) {
        if ($a -like '--progress*') { $progressArgs += $a } else { $filteredSubArgs += $a }
    }

    $args = @('compose') + $progressArgs + $baseArgs + $filteredSubArgs
    Write-Host "Running: docker $($args -join ' ')" -ForegroundColor Cyan

    # Use Start-Process to capture stdout/stderr to avoid PowerShell treating stderr writes as terminating errors
    $stdoutFile = [System.IO.Path]::GetTempFileName()
    $stderrFile = [System.IO.Path]::GetTempFileName()
    try {
        $proc = Start-Process -FilePath 'docker' -ArgumentList $args -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
        $out = Get-Content -Raw -ErrorAction SilentlyContinue $stdoutFile
        $err = Get-Content -Raw -ErrorAction SilentlyContinue $stderrFile
        if ($out) { Write-Host $out }
        if ($err) { Write-Host $err -ForegroundColor Yellow }
        return $proc.ExitCode
    } finally {
        Remove-Item -ErrorAction SilentlyContinue $stdoutFile, $stderrFile
    }
}

# Build
$buildSubArgs = @('build')
if ($Pull) { $buildSubArgs += '--pull' }
if ($NoCache) { $buildSubArgs += '--no-cache' }
# Force plain progress output so Docker shows build logs in CI/terminals
$buildSubArgs += '--progress=plain'

Write-Host "Starting docker compose build (this may take several minutes)..." -ForegroundColor Cyan

$exit = Run-Compose $buildSubArgs
if ($exit -ne 0) {
    Write-Error "Docker compose build failed (exit code $exit)."
    exit $exit
}
Write-Host "Build completed successfully." -ForegroundColor Green

if ($Up) {
    $upSubArgs = @('up')
    if ($Detach) { $upSubArgs += '-d' }
    $exit = Run-Compose $upSubArgs
    if ($exit -ne 0) {
        Write-Error "Docker compose up failed (exit code $exit)."
        exit $exit
    }

    Write-Host "Services are up." -ForegroundColor Green
    if ($Detach) {
        Write-Host "To follow logs: docker compose -f `"$composeFile`" logs -f"
    }
} else {
    Write-Host "Finished (no 'Up' requested). If you want to start services, rerun with -Up." -ForegroundColor Yellow
}
