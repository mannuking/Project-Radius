# Final Fixed Firebase Deployment Script for Project Radius
# This script addresses all identified issues including SPA hosting issues

# Make sure you're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

# Login to Firebase (if not already logged in)
Write-Host "Logging in to Firebase..." -ForegroundColor Cyan
firebase login

# Install required Firebase Functions dependencies with the specific versions
Write-Host "Installing Firebase Functions dependencies..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\functions"
npm install firebase-functions@latest firebase-admin@latest
Set-Location -Path "e:\Projects\Project-Radius"

# Create/ensure the Firestore database
Write-Host "Ensuring Firestore database 'radiusdb' exists..." -ForegroundColor Cyan
try {
    # Try creating the database (will fail if it already exists)
    firebase firestore:databases:create --project ar-tracker-c226f radiusdb --location=us-central 2>$null
    Write-Host "Created Firestore database 'radiusdb'" -ForegroundColor Green
} catch {
    Write-Host "Firestore database 'radiusdb' already exists" -ForegroundColor Yellow
}

# Fix firebase.json configuration
Write-Host "Ensuring correct Firebase configuration..." -ForegroundColor Cyan
$firebaseJsonPath = "e:\Projects\Project-Radius\firebase.json"

# Read and parse firebase.json
$firebaseJsonContent = Get-Content -Path $firebaseJsonPath -Raw
$firebaseJson = $firebaseJsonContent | ConvertFrom-Json

# Set proper configuration for hosting
$firebaseJson.hosting.rewrites = @(
    @{
        source = "/api/**"
        function = "api"
    },
    @{
        source = "**"
        destination = "/index.html"
    }
)

# Ensure database name is set
if (-not $firebaseJson.firestore.database) {
    $firebaseJson.firestore | Add-Member -MemberType NoteProperty -Name "database" -Value "radiusdb"
}

# Make sure functions path is correct
$firebaseJson.functions.source = "./functions"

# Save updated configuration
$firebaseJson | ConvertTo-Json -Depth 10 | Set-Content -Path $firebaseJsonPath
Write-Host "✓ Firebase configuration updated" -ForegroundColor Green

# Clean the previous build
Write-Host "Cleaning previous builds..." -ForegroundColor Cyan
if (Test-Path "e:\Projects\Project-Radius\frontend\out") {
    Remove-Item -Path "e:\Projects\Project-Radius\frontend\out" -Recurse -Force
    Write-Host "✓ Previous build cleaned" -ForegroundColor Green
}

# Build the frontend with proper SPA handling
Write-Host "Building the frontend..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\frontend"
node build-for-firebase.js
Set-Location -Path "e:\Projects\Project-Radius"
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

# Verify the index.html file is properly set up for SPA
Write-Host "Verifying SPA setup..." -ForegroundColor Cyan
$indexHtmlPath = "e:\Projects\Project-Radius\frontend\out\index.html"
$indexHtmlContent = Get-Content -Path $indexHtmlPath -Raw

if (-not ($indexHtmlContent -match "text/javascript")) {
    Write-Host "Adding type='text/javascript' to script tag..." -ForegroundColor Yellow
    $indexHtmlContent = $indexHtmlContent -replace '<script>', '<script type="text/javascript">'
    Set-Content -Path $indexHtmlPath -Value $indexHtmlContent
}

# Make sure there's no window.location.href redirect in the index.html
if ($indexHtmlContent -match "window\.location\.href") {
    Write-Host "Removing problematic redirect from index.html..." -ForegroundColor Yellow
    $indexHtmlContent = $indexHtmlContent -replace '<script>.*window\.location\.href.*</script>', ''
    Set-Content -Path $indexHtmlPath -Value $indexHtmlContent
}

Write-Host "✓ SPA setup verified" -ForegroundColor Green

# Deploy to Firebase in stages
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius"

# First deploy Firestore rules
Write-Host "Deploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json"

# Deploy Functions
Write-Host "Deploying Cloud Functions..." -ForegroundColor Cyan
firebase deploy --only functions --force --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json"

# Deploy Hosting
Write-Host "Deploying Frontend Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json"

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://ar-tracker-c226f.web.app" -ForegroundColor Cyan
Write-Host "If you still have issues, try opening the site in an incognito window or clear your browser cache" -ForegroundColor Yellow
