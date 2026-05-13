# PostgreSQL backup for Vital Registration API (Hermata Merkato Kebele).
# Requires pg_dump on PATH. Set DATABASE_URL in the environment (same as Nest/Prisma).
#
# Example (PowerShell):
#   cd vital-api
#   $env:DATABASE_URL = "postgresql://user:pass@localhost:5432/vital_db"
#   .\scripts\backup-database.ps1
#
# Schedule via Windows Task Scheduler nightly for automatic backups.

param(
    [string]$OutputDir = (Join-Path $PSScriptRoot ".." "backups")
)

$ErrorActionPreference = "Stop"
$url = $env:DATABASE_URL
if (-not $url) {
    Write-Error "DATABASE_URL is not set."
}

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    Write-Error "pg_dump not found. Install PostgreSQL client tools and add them to PATH."
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outFile = Join-Path $OutputDir "vital_backup_$stamp.sql"

Write-Host "Writing backup to $outFile"
pg_dump $url --no-owner --format=p --file $outFile
Write-Host "Done."
