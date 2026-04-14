param(
    [Parameter(Mandatory = $true)]
    [string]$Slug
)

$envFile = Join-Path $PSScriptRoot "article-publisher.env"

if (-not (Test-Path $envFile)) {
    Write-Error "Missing file: $envFile"
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*#") { return }
    if ($_ -match "^\s*$") { return }

    $parts = $_ -split "=", 2
    if ($parts.Length -eq 2) {
        [System.Environment]::SetEnvironmentVariable($parts[0], $parts[1], "Process")
    }
}

$apiBase = [System.Environment]::GetEnvironmentVariable("ARTICLE_API_BASE_URL", "Process")

if (-not $apiBase) {
    Write-Error "Missing ARTICLE_API_BASE_URL in env file"
    exit 1
}

$response = Invoke-RestMethod `
    -Uri "$apiBase/articles/$Slug" `
    -Method GET

if (-not $response.language -or ($response.language -ne "ru" -and $response.language -ne "en")) {
    Write-Warning "Article response missing expected language field (ru/en). Worker may be outdated."
}

if (-not $response.translation_key) {
    Write-Warning "Article response missing expected translation_key field. Worker may be outdated."
}

$response | ConvertTo-Json -Depth 10