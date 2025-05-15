# Firestore Database Troubleshooting for Project Radius

This guide addresses the specific issue with the Firestore database named 'radiusdb' in the Project Radius application.

## Current Issue

The application has been configured to use a specific Firestore database named 'radiusdb', but there are connectivity issues that prevent the site from loading properly.

## Fixing the Database Connection

### 1. Check Database Existence

First, make sure the 'radiusdb' database actually exists in your Firebase project:

```powershell
firebase firestore:databases:list
```

This will show all databases in your Firebase project. Make sure 'radiusdb' is in the list.

### 2. Create the Database (if needed)

If 'radiusdb' doesn't exist, you need to create it:

```powershell
firebase firestore:databases:create --database=radiusdb --location=us-central
```

### 3. Ensure Firestore Rules Are Deployed

Make sure your Firestore security rules are properly deployed for the custom database:

```powershell
firebase deploy --only firestore:rules --database=radiusdb
```

## Updated Configuration Files

We've updated several files to work specifically with your 'radiusdb' database:

1. **functions/index.js**: Now properly initializes Firestore with the 'radiusdb' database.
2. **functions/main.py**: Updated to connect to the correct database instance.
3. **ErrorBoundary.tsx**: Enhanced to detect and provide specific guidance for Firebase database issues.
4. **api-config.ts**: Improved to handle caching issues that might prevent proper loading.

## Deployment Instructions

Use the new specialized deployment script:

```powershell
.\deploy-with-custom-db.ps1
```

This script:
- Checks for the existence of 'radiusdb'
- Ensures proper configuration of all Firebase components
- Deploys with explicit database references

## Clearing Browser Cache

If the site still doesn't load properly after deployment:

1. Open browser DevTools (F12)
2. Right-click on the reload button and select "Empty Cache and Hard Reload"
3. Or use the "Clear Cache & Refresh Page" button now available on the error screen

## Testing the Connection

To test if the connection to 'radiusdb' is working properly:

```powershell
# Run this from the project root
cd functions
npm run serve
```

This will start the Firebase emulator, which you can use to test the connection locally.

## Common Issues and Solutions

### "Project doesn't exist" Error

If you see an error mentioning "Project 'ar-tracker-c226f' or database 'radiusdb' does not exist":

1. Make sure you're logged in with the correct Firebase account
2. Verify the project ID in your .firebaserc file matches your actual Firebase project ID
3. Check if you need to set up a billing account for the project

### API Calls Not Completing

If API calls seem to start but never finish:

1. Check the Network tab in DevTools to see specific error responses
2. Verify CORS is properly configured in your Firebase Functions (already set up in our updated code)
3. Ensure your API routes match the rewrites defined in firebase.json

### Non-Default Database Access

When using a non-default database like 'radiusdb', make sure:

1. All Firebase Admin SDK initializations specify the database name
2. Security rules are deployed specifically for this database
3. The database exists and is in the same region specified in your configuration
