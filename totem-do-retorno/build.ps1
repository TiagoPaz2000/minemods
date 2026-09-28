# Gera dist/totem-do-retorno-<versao>.mcaddon com os dois packs.
# Uso: powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$root = $PSScriptRoot
$bp = Get-Content "$root\behavior_pack\manifest.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$rp = Get-Content "$root\resource_pack\manifest.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$version = $bp.header.version -join '.'

# Todas as versões precisam bater (ver "Como versionar" no README).
$erros = @()
$versoes = @(, $rp.header.version) +@($bp.modules | % { , $_.version }) + @($rp.modules | % { , $_.version }) +
    @($bp.dependencies | ? uuid | % { , $_.version })
foreach ($v in $versoes) { if (($v -join '.') -ne $version) { $erros += "versão $($v -join '.') diferente de $version nos manifests" } }
foreach ($m in $bp, $rp) { if (-not $m.header.description.StartsWith("v$version ")) { $erros += "descrição de '$($m.header.name)' não começa com 'v$version '" } }
if (-not (Select-String -Path "$root\README.md" -SimpleMatch "**Versão atual:** $version" -Quiet)) { $erros += "README sem 'Versão atual: $version'" }
if ($erros) { $erros | % { Write-Host "ERRO: $_" -ForegroundColor Red }; exit 1 }

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

# Cópia com nome fixo, versionada no Git: é o alvo do link de download no README.
$download = Join-Path $root 'download'
New-Item -ItemType Directory -Force $download | Out-Null
Copy-Item $out (Join-Path $download 'totem-do-retorno.mcaddon') -Force
Write-Host "Atualizado: $download\totem-do-retorno.mcaddon"
