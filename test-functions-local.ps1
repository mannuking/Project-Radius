# Test Firebase Functions locally
# This script helps test your Firebase Functions locally

# Make sure you're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Please install it with: npm install -g firebase-tools" -ForegroundColor Red
    exit
}

# Install dependencies in functions folder
Write-Host "Installing Functions dependencies..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius\functions"
npm install

# Start Firebase emulators
Write-Host "Starting Firebase emulators..." -ForegroundColor Cyan
Write-Host "This will allow you to test your API locally" -ForegroundColor Yellow
Write-Host "Access the emulator UI at: http://localhost:4000" -ForegroundColor Green
Write-Host "Test the API at: http://localhost:5001/api/ar-data" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the emulators when done" -ForegroundColor Yellow

firebase emulators:start --only functions

# Note: The script will wait here while emulators are running
