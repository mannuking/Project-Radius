# Fixing Project Radius Deployment Issues

This guide helps resolve the specific errors encountered when deploying the Project Radius application to Firebase.

## Issue 1: Missing 404.html File

The build script was failing to create the 404.html file because it couldn't find index.html. This has been fixed in the updated `build-for-firebase.js` script, which now:

1. Exports the Next.js app to static HTML
2. Creates a basic index.html file if it doesn't exist
3. Creates 404.html from index.html

## Issue 2: Firebase Functions Missing Dependencies

The Firebase Functions deployment was failing because the `firebase-functions` module was missing. This has been fixed by:

1. Adding an npm install step in the deployment scripts
2. Updating the `index.js` file to use the latest Firebase Functions v2 syntax
3. Specifying the runtime in firebase.json

## How to Deploy Now

Run the following command to deploy your application:

```powershell
.\firebase-setup.ps1
```

Or, if you prefer to do it step by step:

1. Install Firebase Functions dependencies:
```powershell
cd e:\Projects\Project-Radius\functions
npm install firebase-functions firebase-admin
```

2. Build the frontend:
```powershell
cd e:\Projects\Project-Radius\frontend
node build-for-firebase.js
```

3. Deploy to Firebase:
```powershell
cd e:\Projects\Project-Radius
firebase deploy --force
```

## Expected Result

After running these commands, your application should be successfully deployed to Firebase, with:

- Frontend running on Firebase Hosting
- Backend API running on Firebase Functions
- API calls from frontend to backend working correctly

You can find the URL to your deployed application in the Firebase console or in the terminal output after deployment.
