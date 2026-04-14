param(
    [Parameter(Mandatory = $true)]
    [string]$JsonFile
)

$envFile = Join-Path $PSScriptRoot "article-publisher.env"

if (-not (Test-Path $envFile)) {
    Write-Error "Missing file: $envFile"
    exit 1
}

if (-not (Test-Path $JsonFile)) {
    Write-Error "Missing article JSON file: $JsonFile"
    exit 1
}

$articleObj = $null
try {
    $articleObj = Get-Content $JsonFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Error "Invalid JSON in file: $JsonFile"
    exit 1
}

$language = [string]$articleObj.language
$translationKey = [string]$articleObj.translation_key

if (-not $language -or ($language -ne "ru" -and $language -ne "en")) {
    Write-Error "Missing or invalid required field: language (expected: ru/en)"
    exit 1
}

if (-not $translationKey) {
    Write-Error "Missing required field: translation_key"
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
$token = [System.Environment]::GetEnvironmentVariable("ARTICLE_ADMIN_TOKEN", "Process")

if (-not $apiBase -or -not $token) {
    Write-Error "Missing ARTICLE_API_BASE_URL or ARTICLE_ADMIN_TOKEN in env file"
    exit 1
}

$body = Get-Content $JsonFile -Raw -Encoding UTF8
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$response = Invoke-RestMethod `
    -Uri "$apiBase/admin/articles" `
    -Method POST `
    -Headers @{
        Authorization = "Bearer $token"
    } `
    -ContentType "application/json; charset=utf-8" `
    -Body $bodyBytes

$response | ConvertTo-Json -Depth 10