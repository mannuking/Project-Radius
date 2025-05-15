# Diagnostic script for Project Radius Firebase deployment
# This script will check various aspects of your deployment and help diagnose issues

# Make sure you're in the project root
Set-Location -Path "e:\Projects\Project-Radius"

function Test-FirebaseHosting {
    Write-Host "Testing Firebase Hosting configuration..." -ForegroundColor Cyan
    
    # Check for essential files
    $hasFirebaseJson = Test-Path -Path "firebase.json"
    $hasFrontendOut = Test-Path -Path "frontend/out"
    
    if (-not $hasFirebaseJson) {
        Write-Host "✘ Missing firebase.json" -ForegroundColor Red
    } else {
        Write-Host "✓ firebase.json exists" -ForegroundColor Green
    }
    
    if (-not $hasFrontendOut) {
        Write-Host "✘ Missing frontend/out directory (Build may not have completed)" -ForegroundColor Red
    } else {
        Write-Host "✓ frontend/out directory exists" -ForegroundColor Green
    }
    
    # Check index.html exists in the out directory
    if (Test-Path -Path "frontend/out/index.html") {
        Write-Host "✓ index.html exists in frontend/out" -ForegroundColor Green
    } else {
        Write-Host "✘ Missing index.html in frontend/out" -ForegroundColor Red
    }
}

function Test-FirebaseFunctions {
    Write-Host "Testing Firebase Functions configuration..." -ForegroundColor Cyan
    
    # Check for essential files
    $hasIndexJs = Test-Path -Path "functions/index.js"
    $hasMainPy = Test-Path -Path "functions/main.py"
    $hasFunctionsPackageJson = Test-Path -Path "functions/package.json"
    $hasFunctionsRequirements = Test-Path -Path "functions/requirements.txt"
    
    if (-not $hasIndexJs) {
        Write-Host "✘ Missing functions/index.js" -ForegroundColor Red
    } else {
        Write-Host "✓ functions/index.js exists" -ForegroundColor Green
    }
    
    if (-not $hasMainPy) {
        Write-Host "✘ Missing functions/main.py" -ForegroundColor Red
    } else {
        Write-Host "✓ functions/main.py exists" -ForegroundColor Green
    }
    
    if (-not $hasFunctionsPackageJson) {
        Write-Host "✘ Missing functions/package.json" -ForegroundColor Red
    } else {
        Write-Host "✓ functions/package.json exists" -ForegroundColor Green
        # Check for correct node version
        $packageJson = Get-Content -Path "functions/package.json" | ConvertFrom-Json
        if ($packageJson.engines.node -eq "20") {
            Write-Host "✓ Node version set to 20" -ForegroundColor Green
        } else {
            Write-Host "✘ Node version not set to 20 (found: $($packageJson.engines.node))" -ForegroundColor Red
        }
    }
    
    if (-not $hasFunctionsRequirements) {
        Write-Host "✘ Missing functions/requirements.txt" -ForegroundColor Red
    } else {
        Write-Host "✓ functions/requirements.txt exists" -ForegroundColor Green
    }
}

function Test-FirebaseFirestore {
    Write-Host "Testing Firestore configuration..." -ForegroundColor Cyan
    
    # Check if we can list databases
    try {
        $result = Invoke-Expression "firebase firestore:databases:list 2>&1"
        Write-Host "Available databases:" -ForegroundColor Green
        Write-Host $result
        
        if ($result -match "radiusdb") {
            Write-Host "✓ 'radiusdb' database found" -ForegroundColor Green
        } else {
            Write-Host "✘ 'radiusdb' database not found in list" -ForegroundColor Red
        }
    } catch {
        Write-Host "✘ Could not list Firestore databases: $($_.Exception.Message)" -ForegroundColor Red
    }
    }
    
    # Check firestore rules
    $hasFirestoreRules = Test-Path -Path "frontend/firestore.rules"
    if (-not $hasFirestoreRules) {
        Write-Host "✘ Missing frontend/firestore.rules" -ForegroundColor Red
    } else {
        Write-Host "✓ frontend/firestore.rules exists" -ForegroundColor Green
    }
}

function Test-ApiConfig {
    Write-Host "Testing API configuration..." -ForegroundColor Cyan
    
    # Check API config file
    $hasApiConfig = Test-Path -Path "frontend/lib/api-config.ts"
    if (-not $hasApiConfig) {
        Write-Host "✘ Missing frontend/lib/api-config.ts" -ForegroundColor Red
    } else {
        Write-Host "✓ frontend/lib/api-config.ts exists" -ForegroundColor Green
        
        # Check content of API config
        $apiConfig = Get-Content -Path "frontend/lib/api-config.ts" -Raw
        if ($apiConfig -match "prodBaseUrl = '/api'") {
            Write-Host "✓ Production API base URL correctly set to '/api'" -ForegroundColor Green
        } else {
            Write-Host "✘ Production API base URL not correctly set" -ForegroundColor Red
        }
    }
}

# Run all tests
Write-Host "Running diagnostic tests for Project Radius deployment..." -ForegroundColor Cyan
Test-FirebaseHosting
Test-FirebaseFunctions
Test-FirebaseFirestore
Test-ApiConfig

# Suggest next steps
Write-Host "`nRecommended next steps:" -ForegroundColor Cyan
Write-Host "1. Run the updated deployment script: .\deploy-with-custom-db.ps1" -ForegroundColor Yellow
Write-Host "2. Check Firebase deployment status: firebase functions:log" -ForegroundColor Yellow
Write-Host "3. Verify database connection in Firebase console" -ForegroundColor Yellow
Write-Host "4. Clear browser cache completely before testing" -ForegroundColor Yellow
