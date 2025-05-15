# Fixing Project Radius Firebase Deployment Issues

This guide addresses the specific issues encountered when deploying Project Radius to Firebase.

## Issues Fixed

1. **Next.js Export Error**
   - Removed redundant `next export` command as Next.js 13+ uses `output: 'export'` in next.config.js

2. **Missing Firestore Database**
   - Added steps to create a Firestore database before deployment

3. **Outdated Firebase Functions**
   - Updated Firebase Functions to v5+ and Firebase Admin
   - Updated Node.js runtime from 18 to 20

4. **Deployment Error Handling**
   - Improved deployment process by splitting it into stages
   - Added better error handling

## How to Deploy

Run the updated deployment script:

```powershell
.\firebase-setup.ps1
```

This script now:
1. Logs in to Firebase
2. Installs the latest Firebase Functions dependencies
3. Creates a Firestore database if needed
4. Builds the Next.js frontend
5. Deploys each Firebase component separately (Firestore, Functions, Hosting)

## Manual Fix (if needed)

If you still encounter issues, you can fix them manually:

### 1. Update Firebase Functions

```powershell
cd e:\Projects\Project-Radius\functions
npm install firebase-functions@latest firebase-admin@latest
```

### 2. Create Firestore Database

```powershell
cd e:\Projects\Project-Radius
firebase firestore:databases:create --location=us-central
```

### 3. Deploy in Stages

```powershell
firebase deploy --only firestore
firebase deploy --only functions --force
firebase deploy --only hosting --force
```

## Verifying Your Deployment

After successful deployment:

1. Check your Firebase Console for the hosting URL
2. Test the frontend by visiting the hosting URL
3. Test the API by making requests to `/api/ar-data` endpoints
4. Verify Firestore is working by checking the Firebase Console

## Troubleshooting Common Issues

### 1. API Connection Issues
- Check the Network tab in browser DevTools
- Verify that API calls are going to the correct endpoint

### 2. Firestore Access Issues
- Verify Firestore rules are properly set up
- Check for any permission errors in the console

### 3. UI Rendering Issues
- Check for any JavaScript errors in the browser console
- Verify that all assets are loading correctly
