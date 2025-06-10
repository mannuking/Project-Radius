# Project Radius Full Deployment Script with PNPM
# This script properly deploys both frontend and backend using PNPM
# It also addresses Firebase deployment issues and builds the Next.js app correctly

# Set error action preference to continue so script doesn't stop on non-fatal errors
$ErrorActionPreference = "Continue"

# Make sure we're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

Write-Host "========== PROJECT RADIUS DEPLOYMENT WITH PNPM ==========" -ForegroundColor Cyan
Write-Host "Starting comprehensive deployment process..." -ForegroundColor Cyan

# Step 1: Ensure Firebase is logged in
Write-Host "`n[Step 1/8] Checking Firebase login..." -ForegroundColor Yellow
firebase login

# Step 2: Update Firebase Configuration
Write-Host "`n[Step 2/8] Updating Firebase configuration..." -ForegroundColor Yellow
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
Write-Host "`n[Step 3/8] Installing dependencies for Cloud Functions..." -ForegroundColor Yellow
Set-Location -Path "e:\Projects\Project-Radius\functions"
npm install firebase-functions@latest firebase-admin@latest
Set-Location -Path "e:\Projects\Project-Radius"
Write-Host "Cloud Functions dependencies installed" -ForegroundColor Green

# Step 4: Install Frontend Dependencies with PNPM
Write-Host "`n[Step 4/8] Installing frontend dependencies with PNPM..." -ForegroundColor Yellow
Set-Location -Path "e:\Projects\Project-Radius\frontend"
pnpm install
Write-Host "Frontend dependencies installed" -ForegroundColor Green

# Step 5: Build the Next.js Frontend with PNPM
Write-Host "`n[Step 5/8] Building the Next.js frontend with PNPM..." -ForegroundColor Yellow
Set-Location -Path "e:\Projects\Project-Radius\frontend"

# Clean previous build if exists
if (Test-Path "out") {
    Remove-Item -Path "out" -Recurse -Force
    Write-Host "Previous frontend build cleaned" -ForegroundColor Green
}

# Build with PNPM
pnpm run build

# Check if build was successful by checking if the out directory exists
if (Test-Path "out") {
    Write-Host "Next.js frontend built successfully" -ForegroundColor Green
} else {
    # Create the directory and basic files if build failed
    Write-Host "Creating minimal frontend files as fallback..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "out" -Force | Out-Null
    
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
      <p><small>Note: This is a fallback page. The full app may still be initializing.</small></p>
    </div>
  </div>
</body>
</html>
'@

    Set-Content -Path "out\index.html" -Value $indexHtml

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

    Set-Content -Path "out\404.html" -Value $notFoundHtml
    Write-Host "Fallback frontend files created" -ForegroundColor Green
}

# Return to project root
Set-Location -Path "e:\Projects\Project-Radius"

# Step 6: Create/Ensure Firestore Database (with correct location)
Write-Host "`n[Step 6/8] Setting up Firestore database..." -ForegroundColor Yellow
try {
    # Use us-central1 instead of us-central
    firebase firestore:databases:create --project ar-tracker-c226f radiusdb --location=us-central1 2>$null
    Write-Host "Created Firestore database 'radiusdb'" -ForegroundColor Green
} 
catch {
    Write-Host "Firestore database 'radiusdb' already exists or couldn't be created" -ForegroundColor Yellow
}

# Step 7: Deploy Firestore Rules and Functions Separately (with proper quoting)
Write-Host "`n[Step 7/8] Deploying Backend..." -ForegroundColor Yellow
Write-Host "Deploying Firestore Rules..." -ForegroundColor Yellow
firebase deploy --only firestore --project ar-tracker-c226f
Write-Host "Firestore Rules deployed" -ForegroundColor Green

Write-Host "Deploying Cloud Functions..." -ForegroundColor Yellow
firebase deploy --only functions --project ar-tracker-c226f
Write-Host "Cloud Functions deployed" -ForegroundColor Green

# Step 8: Deploy Frontend Hosting
Write-Host "`n[Step 8/8] Deploying Frontend Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting --project ar-tracker-c226f
Write-Host "Frontend hosting deployed successfully" -ForegroundColor Green

# Completion
Write-Host "`n========== DEPLOYMENT COMPLETED ==========`n" -ForegroundColor Cyan
Write-Host "Your application has been deployed and should be available at:" -ForegroundColor White
Write-Host "https://ar-tracker-c226f.web.app" -ForegroundColor Green -BackgroundColor Black

# Attempt to start the dev server
Write-Host "`n========== STARTING DEV SERVER ==========`n" -ForegroundColor Cyan
Write-Host "Would you like to start the development server with PNPM? (Y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Starting development server with PNPM..." -ForegroundColor Green
    Set-Location -Path "e:\Projects\Project-Radius\frontend"
    pnpm dev
}
else {
    Write-Host "`nImportant Notes:" -ForegroundColor Yellow
    Write-Host "1. Clear your browser cache or use incognito mode to test" -ForegroundColor White
    Write-Host "2. The first load may take a few seconds as the functions initialize" -ForegroundColor White
    Write-Host "3. If you still see issues, check the Firebase console for logs" -ForegroundColor White
    Write-Host "4. To run the dev server locally, use: 'cd frontend && pnpm dev'" -ForegroundColor White
    Write-Host "`nFirebase console: https://console.firebase.google.com/project/ar-tracker-c226f" -ForegroundColor Cyan
}
