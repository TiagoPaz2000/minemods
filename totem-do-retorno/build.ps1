# Gera dist/totem-do-retorno-<versao>.mcaddon com os dois packs.
# Uso: powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$root = $PSScriptRoot
$version = (Get-Content "$root\behavior_pack\manifest.json" -Raw | ConvertFrom-Json).header.version -join '.'
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null
$out = Join-Path $dist "totem-do-retorno-$version.mcaddon"
if (Test-Path $out) { Remove-Item $out }

# ZipArchive manual para gravar caminhos com '/' (Compress-Archive do PS 5.1 usa '\', que quebra no mobile).
$zip = [System.IO.Compression.ZipFile]::Open($out, 'Create')
try {
    foreach ($pack in 'behavior_pack', 'resource_pack') {
        Get-ChildItem "$root\$pack" -Recurse -File | ForEach-Object {
            $entry = $_.FullName.Substring($root.Length + 1) -replace '\\', '/'
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry) | Out-Null
        }
    }
} finally {
    $zip.Dispose()
}
Write-Host "Gerado: $out"
