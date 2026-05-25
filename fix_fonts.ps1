$baseDir = "C:\Users\Johan\.gemini\antigravity\scratch\for-rent-barbados\static-site"
$baseUrl = "https://forrentbarbados.com"

# Find all 0-byte files in static-site
$zeroByteFiles = Get-ChildItem -Path $baseDir -Recurse | Where-Object { $_.Length -eq 0 -and $_.PSIsContainer -eq $false }

foreach ($file in $zeroByteFiles) {
    # Calculate relative path (e.g. wp-content\plugins\...)
    $relativePath = $file.FullName.Substring($baseDir.Length + 1).Replace('\', '/')
    
    $url = "$baseUrl/$relativePath"
    
    Write-Host "Downloading $url ..."
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $file.FullName -UseBasicParsing
        Write-Host "  -> Success"
    } catch {
        Write-Host "  -> Failed: $($_.Exception.Message)"
    }
}
