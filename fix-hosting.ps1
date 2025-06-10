# Simple SPA Fix for Firebase Hosting

# Update firebase.json
Write-Host "Updating firebase.json..." -ForegroundColor Cyan
$firebaseJsonPath = "e:\Projects\Project-Radius\firebase.json"
$firebaseJson = Get-Content $firebaseJsonPath | ConvertFrom-Json

# Create a new rewrites array
$newRewrites = @()
$newRewrites += @{ source = "/api/**"; function = "api" }
$newRewrites += @{ source = "**"; destination = "/index.html" }

# Update the hosting section
$firebaseJson.hosting.rewrites = $newRewrites

# Save the file
$firebaseJson | ConvertTo-Json -Depth 10 | Set-Content $firebaseJsonPath
Write-Host "firebase.json updated" -ForegroundColor Green

# Deploy only hosting to Firebase
Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius"
firebase deploy --only hosting --project ar-tracker-c226f

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://ar-tracker-c226f.web.app" -ForegroundColor Cyan
Write-Host "Clear your browser cache or use an incognito window to test" -ForegroundColor Yellow
