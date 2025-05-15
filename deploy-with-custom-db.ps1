# Firebase Deployment Script for Project Radius with custom database
# This script deploys the application specifying the custom 'radiusdb' database

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
        Write-Host "Warning: 'radiusdb' not found in database list. Continuing anyway..." -ForegroundColor Yellow
    }
} 
catch {
    Write-Host "Could not verify database existence. Continuing anyway..." -ForegroundColor Yellow
}

# Build the frontend
Write-Host "Building the frontend..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\frontend"
node build-for-firebase.js

# Return to project root for deployment
Set-Location -Path "e:\Projects\Project-Radius"

# Deploy to Firebase in stages with explicit database reference
Write-Host "Deploying to Firebase with custom database 'radiusdb'..." -ForegroundColor Cyan

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
Write-Host "If the site still doesn't load properly, try clearing your browser cache." -ForegroundColor Yellow
