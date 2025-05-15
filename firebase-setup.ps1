# Firebase Setup Commands for Project Radius
# Run these commands in sequence to set up Firebase correctly

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

# Create Firestore database if it doesn't exist
Write-Host "Creating Firestore database if needed..." -ForegroundColor Cyan
try {
    $result = Invoke-Expression "firebase firestore:databases:create --location=us-central 2>&1"
    Write-Host "✓ Firestore database created" -ForegroundColor Green
} catch {
    Write-Host "Firestore database may already exist. Continuing..." -ForegroundColor Yellow
}

# Build the frontend
Write-Host "Building the frontend..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\frontend"
node build-for-firebase.js

# Return to project root for deployment
Set-Location -Path "e:\Projects\Project-Radius"

# Deploy to Firebase in stages to avoid dependency issues
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy --only firestore
firebase deploy --only functions --force
firebase deploy --only hosting --force

Write-Host "Deployment complete! Check the Firebase console for your hosting URL." -ForegroundColor Green
