# Firebase Setup Guide for Project Radius

This document provides step-by-step instructions for setting up Firebase for your Project Radius application. Follow these instructions to properly configure both frontend and backend deployment.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account and project created

## Step 1: Firebase Login
```powershell
firebase login
```

## Step 2: Initialize Firebase from Project Root
1. Navigate to the project root:
```powershell
cd e:\Projects\Project-Radius
```

2. Initialize Firebase:
```powershell
firebase init
```

3. When prompted, select:
   - Firestore
   - Functions 
   - Hosting

4. For the project selection, choose your existing Firebase project (`ar-tracker-c226f`)

5. For Firestore configuration:
   - Rules file: `frontend/firestore.rules`
   - Indexes file: `frontend/firestore.indexes.json`

6. For Functions configuration:
   - Language: JavaScript (we'll manually configure it for Python)
   - ESLint: No

7. For Hosting configuration:
   - Public directory: `frontend/out`
   - Configure as a single-page app: Yes
   - Set up automatic builds: No

## Step 3: Manual Configuration
After Firebase initialization is complete, ensure the following files are correctly configured:

1. `firebase.json` (at project root) should point to:
   - Hosting: `frontend/out`
   - Functions: `functions/`
   - Firestore rules: `frontend/firestore.rules`

2. Functions directory contains:
   - `main.py` - Your Python Cloud Functions code
   - `requirements.txt` - Python dependencies
   - `package.json` - Node.js configuration
   - `index.js` - Connector file

## Step 4: Deploy
Run the deployment script to build and deploy everything:
```powershell
.\deploy.ps1
```

## Troubleshooting

### Problem: Functions deployment fails
- Ensure Python 3.7+ is installed
- Check that `requirements.txt` includes all needed dependencies
- Verify Firebase CLI is up to date

### Problem: 404 errors on frontend routes
- Ensure routing is properly configured in `firebase.json`
- Check that SPA redirect is set up

### Problem: API calls failing
- Check Firebase Functions logs in the Firebase Console
- Verify the API routes are configured correctly in `firebase.json`
- Ensure the `api-config.ts` file is using the correct production URL
