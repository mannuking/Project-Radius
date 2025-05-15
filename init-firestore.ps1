# Initialize Firestore Database for Project Radius
# Run this script to create the Firestore database

# Make sure you're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

Write-Host "Creating Firestore database for Project Radius..." -ForegroundColor Cyan

# Create the Firestore database
firebase firestore:databases:create --location=us-central

Write-Host "Firestore database created successfully!" -ForegroundColor Green
Write-Host "You can now continue with deployment." -ForegroundColor Cyan
