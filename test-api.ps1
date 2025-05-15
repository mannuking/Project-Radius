# API Test Script for Project Radius
# This script tests the connection to your Firebase Functions API

param (
    [string]$BaseUrl = "https://us-central1-ar-tracker-c226f.cloudfunctions.net/api",
    [switch]$Local = $false
)

# If local testing is enabled, use localhost
if ($Local) {
    $BaseUrl = "http://localhost:5001/api"
    Write-Host "Testing local API at: $BaseUrl" -ForegroundColor Yellow
} else {
    Write-Host "Testing deployed API at: $BaseUrl" -ForegroundColor Yellow
}

# Test the API endpoint
Write-Host "Testing API connection..." -ForegroundColor Cyan

try {
    # Make the API request
    $response = Invoke-WebRequest -Uri "$BaseUrl/ar-data" -Method GET -TimeoutSec 30
    
    # Check status code
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API connection successful (Status: $($response.StatusCode))" -ForegroundColor Green
        
        # Parse response
        $content = $response.Content | ConvertFrom-Json
        
        # Display summary of response
        Write-Host "`nAPI Response Summary:" -ForegroundColor Cyan
        Write-Host "- Total Invoices: $($content.summary.totalInvoices)" -ForegroundColor Green
        Write-Host "- Total Outstanding: $($content.summary.totalOutstanding)" -ForegroundColor Green
        Write-Host "- Overdue Invoices: $($content.summary.overdueInvoices)" -ForegroundColor Green
        
        Write-Host "`nAging Buckets:" -ForegroundColor Cyan
        foreach ($bucket in $content.agingBuckets.PSObject.Properties) {
            Write-Host "- $($bucket.Name): Count: $($bucket.Value.count), Amount: $($bucket.Value.amount)" -ForegroundColor Green
        }
        
        Write-Host "`nAPI Connection Verified ✓" -ForegroundColor Green
    } else {
        Write-Host "✘ API returned unexpected status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✘ API connection failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Additional diagnosis
    if ($_.Exception.Message -match "Unable to connect") {
        Write-Host "`nPossible causes:" -ForegroundColor Yellow
        Write-Host "1. Firebase Functions are not deployed correctly" -ForegroundColor Yellow
        Write-Host "2. The API endpoint URL is incorrect" -ForegroundColor Yellow
        Write-Host "3. Network connectivity issues" -ForegroundColor Yellow
        
        Write-Host "`nTry the following:" -ForegroundColor Cyan
        Write-Host "- Run the deploy script again: .\deploy-with-custom-db.ps1" -ForegroundColor Cyan
        Write-Host "- Test the API locally: .\test-api.ps1 -Local" -ForegroundColor Cyan
        Write-Host "- Check the Firebase Functions logs: firebase functions:log" -ForegroundColor Cyan
    } elseif ($_.Exception.Message -match "timeout") {
        Write-Host "`nAPI request timed out. This could indicate:" -ForegroundColor Yellow
        Write-Host "1. Cloud Functions are experiencing high latency" -ForegroundColor Yellow
        Write-Host "2. Your backend code might have performance issues" -ForegroundColor Yellow
        Write-Host "3. Firestore database connection is slow or failing" -ForegroundColor Yellow
        
        Write-Host "`nTry the following:" -ForegroundColor Cyan
        Write-Host "- Check Firebase Function logs: firebase functions:log" -ForegroundColor Cyan 
        Write-Host "- Verify your Firestore database 'radiusdb' is accessible" -ForegroundColor Cyan
    }
}

Write-Host "`nTest complete." -ForegroundColor Cyan
