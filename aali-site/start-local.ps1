$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$nodeFolder = Join-Path $runtimeRoot 'node\bin'
$pnpmCommand = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'
if (Test-Path -LiteralPath $pnpmCommand) {
    $env:PATH = $nodeFolder + ';' + $env:PATH
} else {
    $pnpmCommand = (Get-Command pnpm -ErrorAction Stop).Source
}
$env:ASTRO_TELEMETRY_DISABLED = '1'
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
    throw 'Dependencies are missing. Run pnpm install --frozen-lockfile before starting the preview.'
}
& $pnpmCommand dev
