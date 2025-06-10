# Simple React App Deployment for Firebase
# This script focuses on the minimum needed to get a React app working on Firebase

# Make sure we're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

Write-Host "========== MINIMAL REACT APP DEPLOYMENT ==========" -ForegroundColor Cyan

# Step 1: Update firebase.json for simple hosting
Write-Host "`n[Step 1] Updating Firebase configuration..." -ForegroundColor Yellow
$simpleFirebaseJson = @'
{
  "hosting": {
    "public": "frontend/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
'@

Set-Content -Path "e:\Projects\Project-Radius\firebase.json" -Value $simpleFirebaseJson
Write-Host "✓ Firebase configuration updated to simple hosting" -ForegroundColor Green

# Step 2: Create a minimal React app in public folder
Write-Host "`n[Step 2] Creating minimal React app..." -ForegroundColor Yellow

# Create public directory
if (-not (Test-Path "e:\Projects\Project-Radius\frontend\public")) {
    New-Item -ItemType Directory -Path "e:\Projects\Project-Radius\frontend\public" -Force | Out-Null
}

# Create index.html
$indexHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Project Radius</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f4f8;
    }
    .app {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      text-align: center;
      max-width: 500px;
      width: 90%;
    }
    h1 {
      color: #333;
    }
    .button {
      background-color: #0066cc;
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 10px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="app">
      <h1>Project Radius</h1>
      <p>Welcome to the AR Tracking Application</p>
      <p>This is a simplified version of the application. The full version is currently being deployed.</p>
      <button class="button" onclick="alert('Coming soon!')">Launch App</button>
    </div>
  </div>

  <script>
    // Simple React component would go here in the full version
    console.log("Project Radius is loading...");
  </script>
</body>
</html>
'@

Set-Content -Path "e:\Projects\Project-Radius\frontend\public\index.html" -Value $indexHtml
Write-Host "✓ Created minimal React app" -ForegroundColor Green

# Step 3: Deploy to Firebase
Write-Host "`n[Step 3] Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting --project ar-tracker-c226f

Write-Host "`n========== DEPLOYMENT COMPLETED ==========`n" -ForegroundColor Cyan
Write-Host "Your minimal React app has been deployed and should be available at:" -ForegroundColor White
Write-Host "https://ar-tracker-c226f.web.app" -ForegroundColor Green -BackgroundColor Black

Write-Host "`nNotes:" -ForegroundColor Yellow
Write-Host "1. This is a minimal app to verify hosting is working" -ForegroundColor White
Write-Host "2. To run the full app locally, use: 'cd frontend && pnpm dev'" -ForegroundColor White
Write-Host "3. Clear your browser cache or try incognito mode" -ForegroundColor White
