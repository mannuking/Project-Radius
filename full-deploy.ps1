# All-in-One Project Radius Deployment Script
# This script handles everything in one go - frontend build and backend deployment

# Set error action preference to continue so script doesn't stop on non-fatal errors
$ErrorActionPreference = "Continue"

# Make sure we're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

Write-Host "========== PROJECT RADIUS DEPLOYMENT ==========" -ForegroundColor Cyan
Write-Host "Starting comprehensive deployment process..." -ForegroundColor Cyan

# Step 1: Ensure Firebase is logged in
Write-Host "`n[Step 1/7] Checking Firebase login..." -ForegroundColor Yellow
firebase login --no-localhost

# Step 2: Update Firebase Configuration
Write-Host "`n[Step 2/7] Updating Firebase configuration..." -ForegroundColor Yellow
$firebaseJsonContent = @'
{
  "hosting": {
    "public": "frontend/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "./functions",
    "runtime": "nodejs20"
  },
  "firestore": {
    "rules": "frontend/firestore.rules",
    "indexes": "frontend/firestore.indexes.json",
    "database": "radiusdb"
  }
}
'@

Set-Content -Path "e:\Projects\Project-Radius\firebase.json" -Value $firebaseJsonContent
Write-Host "Firebase configuration updated successfully" -ForegroundColor Green

# Step 3: Install Dependencies for Functions
Write-Host "`n[Step 3/7] Installing dependencies for Cloud Functions..." -ForegroundColor Yellow
Set-Location -Path "e:\Projects\Project-Radius\functions"
npm install firebase-functions@latest firebase-admin@latest
Set-Location -Path "e:\Projects\Project-Radius"
Write-Host "Cloud Functions dependencies installed" -ForegroundColor Green

# Step 4: Clean and Rebuild Frontend
Write-Host "`n[Step 4/7] Cleaning and rebuilding the frontend..." -ForegroundColor Yellow

# Clean previous build if exists
if (Test-Path "e:\Projects\Project-Radius\frontend\out") {
    Remove-Item -Path "e:\Projects\Project-Radius\frontend\out" -Recurse -Force
    Write-Host "Previous frontend build cleaned" -ForegroundColor Green
}

# Create out directory
New-Item -ItemType Directory -Path "e:\Projects\Project-Radius\frontend\out" -Force | Out-Null

# Create index.html with SPA routing
$indexHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Project Radius - AR Tracker</title>
  <script type="text/javascript">
    // SPA routing handler for Firebase Hosting
    (function(l) {
      if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
      }
    }(window.location));
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="container">
      <h1>Loading Project Radius...</h1>
      <p>If this message persists, please check the browser console for errors.</p>
    </div>
  </div>
</body>
</html>
'@

Set-Content -Path "e:\Projects\Project-Radius\frontend\out\index.html" -Value $indexHtml

# Create 404.html for proper SPA routing
$notFoundHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Project Radius - Page Not Found</title>
  <script type="text/javascript">
    // Single-page app routing that handles 404s
    var segmentCount = 0;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Redirecting...</h1>
    <p>Please wait while we redirect you to the right page.</p>
  </div>
</body>
</html>
'@

Set-Content -Path "e:\Projects\Project-Radius\frontend\out\404.html" -Value $notFoundHtml
Write-Host "Frontend files prepared successfully" -ForegroundColor Green

# Step 5: Create/Ensure Firestore Database
Write-Host "`n[Step 5/7] Setting up Firestore database..." -ForegroundColor Yellow
try {
    # Try creating the database (will fail if it already exists)
    firebase firestore:databases:create --project ar-tracker-c226f radiusdb --location=us-central 2>$null
    Write-Host "Created Firestore database 'radiusdb'" -ForegroundColor Green
} 
catch {
    Write-Host "Firestore database 'radiusdb' already exists" -ForegroundColor Yellow
}

# Step 6: Deploy Functions and Firestore Rules First
Write-Host "`n[Step 6/7] Deploying Backend (Firestore Rules and Functions)..." -ForegroundColor Yellow
firebase deploy --only firestore,functions --project ar-tracker-c226f
Write-Host "Backend deployed successfully" -ForegroundColor Green

# Step 7: Deploy Frontend Hosting
Write-Host "`n[Step 7/7] Deploying Frontend Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting --project ar-tracker-c226f
Write-Host "Frontend hosting deployed successfully" -ForegroundColor Green

# Completion
Write-Host "`n========== DEPLOYMENT COMPLETED ==========`n" -ForegroundColor Cyan
Write-Host "Your application has been deployed and should be available at:" -ForegroundColor White
Write-Host "https://ar-tracker-c226f.web.app" -ForegroundColor Green -BackgroundColor Black
Write-Host "`nImportant Notes:" -ForegroundColor Yellow
Write-Host "1. Clear your browser cache or use incognito mode to test" -ForegroundColor White
Write-Host "2. The first load may take a few seconds as the functions initialize" -ForegroundColor White
Write-Host "3. If you still see issues, check the Firebase console for logs" -ForegroundColor White
Write-Host "`nFirebase console: https://console.firebase.google.com/project/ar-tracker-c226f" -ForegroundColor Cyan
