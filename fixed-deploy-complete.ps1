# Complete Fixed Firebase Deployment Script for Project Radius
# This script resolves the SPA routing, Firestore database issues, and path reference issues

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

# Ensure the Firestore database exists using the specific named database
Write-Host "Validating/creating Firestore database 'radiusdb'..." -ForegroundColor Cyan
try {
    # Create the radiusdb database if it doesn't exist
    firebase firestore:databases:create radiusdb --location=us-central --project ar-tracker-c226f
    Write-Host "Firestore database 'radiusdb' exists or has been created" -ForegroundColor Green
} catch {
    Write-Host "Note: Database may already exist or couldn't be created. Continuing..." -ForegroundColor Yellow
}

# Build the frontend with proper SPA handling
Write-Host "Building the frontend..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\frontend"
node build-for-firebase.js

# Make sure the index.html handles SPA routing correctly
Write-Host "Ensuring proper SPA routing..." -ForegroundColor Cyan
$indexHtmlPath = "e:\Projects\Project-Radius\frontend\out\index.html"
if (Test-Path -Path $indexHtmlPath) {
    $indexContent = Get-Content -Path $indexHtmlPath -Raw
    
    if ($indexContent -match "window.location.href = '/'") {
        Write-Host "Fixing routing in index.html..." -ForegroundColor Yellow
        $fixedContent = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Radius - AR Tracker</title>
    <script>
      // Handle SPA routing
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      }(window.location));
    </script>
  </head>
  <body>
    <div id="root">
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center;">
          <h1>Loading Project Radius...</h1>
          <p>If this message persists, please check the browser console for errors.</p>
        </div>
      </div>
    </div>
  </body>
</html>
"@
        Set-Content -Path $indexHtmlPath -Value $fixedContent
        Write-Host "✓ index.html fixed for SPA routing" -ForegroundColor Green
    }
}

# Return to project root for deployment
Set-Location -Path "e:\Projects\Project-Radius"

# Copy Firebase config files to ensure consistent deployment
Write-Host "Ensuring Firebase configuration consistency..." -ForegroundColor Cyan

# Ensure firebase.json in root has proper configuration
$rootFirebaseJson = Get-Content -Path "e:\Projects\Project-Radius\firebase.json" -Raw | ConvertFrom-Json

# Make sure database name is specified in the configuration
if (-not $rootFirebaseJson.firestore.database) {
    Write-Host "Adding database name to firebase.json..." -ForegroundColor Yellow
    $rootFirebaseJson.firestore.database = "radiusdb"
    $rootFirebaseJson | ConvertTo-Json -Depth 10 | Set-Content -Path "e:\Projects\Project-Radius\firebase.json"
    Write-Host "✓ Added database name to firebase.json" -ForegroundColor Green
}

# Deploy to Firebase in stages with explicit config
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan

# Deploy Firestore rules first
Write-Host "Deploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json"

# Deploy Functions 
Write-Host "Deploying Cloud Functions..." -ForegroundColor Cyan
firebase deploy --only functions --force --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json" 

# Deploy Hosting last
Write-Host "Deploying Frontend Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting --force --project ar-tracker-c226f --config "e:\Projects\Project-Radius\firebase.json"

Write-Host "Deployment complete! Check the Firebase console for your hosting URL." -ForegroundColor Green
Write-Host "Your site should now be working at: https://ar-tracker-c226f.web.app" -ForegroundColor Green
Write-Host "If the site still doesn't load properly, try hard refreshing with Ctrl+F5" -ForegroundColor Yellow
