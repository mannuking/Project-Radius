# Build and deploy script for Project Radius
# This script deploys both frontend and backend to Firebase

# Set up color codes for console output
$colors = @{
    reset = "`e[0m"
    bright = "`e[1m"
    green = "`e[32m"
    cyan = "`e[36m"
    yellow = "`e[33m"
    red = "`e[31m"
}

Write-Host "$($colors.bright)$($colors.cyan)=== Project Radius Deployment ===$($colors.reset)`n"

# Step 1: Build the Next.js frontend
try {
    Write-Host "$($colors.yellow)Step 1: Building Next.js frontend...$($colors.reset)"
    Set-Location -Path "e:\Projects\Project-Radius\frontend"
    node build-for-firebase.js
    Write-Host "$($colors.green)✓ Frontend build completed$($colors.reset)`n"
}
catch {
    Write-Host "$($colors.red)✗ Frontend build failed: $_$($colors.reset)"
    exit 1
}

# Step 2: Prepare Firebase Functions directory
try {
    Write-Host "$($colors.yellow)Step 2: Preparing Firebase Functions...$($colors.reset)"
    
    # Make sure the functions directory exists
    if (-not (Test-Path -Path "e:\Projects\Project-Radius\functions")) {
        New-Item -Path "e:\Projects\Project-Radius\functions" -ItemType Directory | Out-Null
    }
    
    # Copy backend data to functions directory
    Copy-Item -Path "e:\Projects\Project-Radius\backend\AR_Model_Dummy_Data.xlsx" -Destination "e:\Projects\Project-Radius\functions\" -Force
    
    Write-Host "$($colors.green)✓ Firebase Functions prepared$($colors.reset)`n"
}
catch {
    Write-Host "$($colors.red)✗ Functions preparation failed: $_$($colors.reset)"
    exit 1
}

# Step 3: Install Firebase Functions dependencies
try {
    Write-Host "$($colors.yellow)Step 3: Installing Firebase Functions dependencies...$($colors.reset)"
    Set-Location -Path "e:\Projects\Project-Radius\functions"
    npm install firebase-functions firebase-admin
    Write-Host "$($colors.green)✓ Firebase Functions dependencies installed$($colors.reset)`n"
}
catch {
    Write-Host "$($colors.red)✗ Firebase Functions dependencies installation failed: $_$($colors.reset)"
    # Continue anyway
}

# Step 4: Check if Firestore database exists and create if needed
try {
    Write-Host "$($colors.yellow)Step 4: Checking Firestore database...$($colors.reset)"
    Set-Location -Path "e:\Projects\Project-Radius"
    
    # Try to deploy just the Firestore rules as a check - if it fails, we need to create the database
    $result = $null
    try {
        $result = Invoke-Expression "firebase deploy --only firestore 2>&1"
    } catch {
        # Silently continue
    }
    
    # If the output contains an error about the database not existing, create it
    if ($result -match "database.*does not exist") {
        Write-Host "Firestore database does not exist. Creating it now..." -ForegroundColor Yellow
        firebase firestore:databases:create --location=us-central
        Write-Host "$($colors.green)✓ Firestore database created$($colors.reset)"
    } else {
        Write-Host "$($colors.green)✓ Firestore database exists$($colors.reset)"
    }
}
catch {
    Write-Host "$($colors.yellow)Could not verify Firestore database. Will attempt deployment anyway.$($colors.reset)"
    # Continue anyway
}

# Step 5: Deploy to Firebase
try {
    Write-Host "$($colors.yellow)Step 5: Deploying to Firebase...$($colors.reset)"
    Set-Location -Path "e:\Projects\Project-Radius"
    
    # First deploy only the firestore and functions 
    firebase deploy --only firestore,functions --force
    
    # Then deploy hosting
    firebase deploy --only hosting --force
    
    Write-Host "$($colors.green)✓ Deployment completed successfully!$($colors.reset)`n"
}
catch {
    Write-Host "$($colors.red)✗ Deployment failed: $_$($colors.reset)"
    exit 1
}

Write-Host "$($colors.bright)$($colors.green)=== Deployment Completed! ===$($colors.reset)`n"
Write-Host "Your application is now live on Firebase!"
Write-Host "Access the hosting URL from your Firebase console."
