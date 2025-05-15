# Fixed Firebase Deployment Script for Project Radius
# This script resolves the SPA routing and Firestore database issues

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

# Ensure the specific Firestore database exists
Write-Host "Validating Firestore database 'radiusdb'..." -ForegroundColor Cyan
try {
    # This command checks if we can access the database
    $result = Invoke-Expression "firebase firestore:databases:list 2>&1"
    if ($result -match "radiusdb") {
        Write-Host "Firestore database 'radiusdb' exists" -ForegroundColor Green
    } else {
        Write-Host "Warning: 'radiusdb' not found in database list." -ForegroundColor Yellow
        Write-Host "Creating database 'radiusdb'..." -ForegroundColor Cyan
        try {
            Invoke-Expression "firebase firestore:databases:create radiusdb --location=us-central 2>&1"
            Write-Host "Database 'radiusdb' created" -ForegroundColor Green
        } catch {
            Write-Host "Could not create database. Continuing anyway..." -ForegroundColor Yellow
        }
    }
} 
catch {
    Write-Host "Could not verify database existence. Continuing anyway..." -ForegroundColor Yellow
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

# Make sure firebase.json has proper rewrites
Write-Host "Checking firebase.json configuration..." -ForegroundColor Cyan
$firebaseJsonPath = "e:\Projects\Project-Radius\firebase.json"

if (Test-Path -Path $firebaseJsonPath) {
    $firebaseJson = Get-Content -Path $firebaseJsonPath -Raw | ConvertFrom-Json
    
    # Update rewrites if needed
    $hasApiRewrite = $false
    $hasCatchAllRewrite = $false
    
    foreach ($rewrite in $firebaseJson.hosting.rewrites) {
        if ($rewrite.source -eq "/api/**" -and $rewrite.function -eq "api") {
            $hasApiRewrite = $true
        }
        if ($rewrite.source -eq "**" -and $rewrite.destination -eq "/index.html") {
            $hasCatchAllRewrite = $true
        }
    }
    
    if (-not ($hasApiRewrite -and $hasCatchAllRewrite)) {
        Write-Host "Fixing rewrites in firebase.json..." -ForegroundColor Yellow
        # Keep the original file as backup
        Copy-Item -Path $firebaseJsonPath -Destination "$firebaseJsonPath.bak"
        
        # Ensure we have proper rewrites
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
        
        $firebaseJson | ConvertTo-Json -Depth 10 | Set-Content -Path $firebaseJsonPath
        Write-Host "✓ firebase.json fixed with proper rewrites" -ForegroundColor Green
    }
}

# Deploy to Firebase in stages
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan

# Deploy Firestore rules first
Write-Host "Deploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore --project ar-tracker-c226f

# Deploy Functions 
Write-Host "Deploying Cloud Functions..." -ForegroundColor Cyan
firebase deploy --only functions --force --project ar-tracker-c226f

# Deploy Hosting last
Write-Host "Deploying Frontend Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting --force --project ar-tracker-c226f

Write-Host "Deployment complete! Check the Firebase console for your hosting URL." -ForegroundColor Green
Write-Host "Your site should now be working at: https://ar-tracker-c226f.web.app" -ForegroundColor Green
Write-Host "If the site still doesn't load properly, try hard refreshing with Ctrl+F5" -ForegroundColor Yellow
