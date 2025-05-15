# Project Radius Deployment Guide

This document guides you through deploying Project Radius to Firebase, which includes both the Next.js frontend and the Python Flask backend.

## Prerequisites

1. Firebase account and a Firebase project
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Firebase login completed (`firebase login`)
4. Node.js and npm (or pnpm) installed 
5. Python 3.7+ installed (for local development)

## Deployment Steps

### Step 1: Build and Deploy

We've created a deployment script that handles the entire process. Run:

```powershell
# From the project root directory
./deploy.ps1
```

This script will:
1. Build the Next.js frontend
2. Prepare the Firebase Functions directory
3. Deploy everything to Firebase

### Step 2: Verify Deployment

After deployment completes, you can visit your application at the Firebase Hosting URL:
- `https://[YOUR-PROJECT-ID].web.app`

### Firebase Resources Used

The deployment creates and uses the following Firebase resources:

1. **Firebase Hosting** - For serving the static Next.js frontend
2. **Firebase Cloud Functions** - For running the Python backend API
3. **Firebase Firestore** - For database storage (if configured)
4. **Firebase Authentication** - For user authentication

## Making Changes After Deployment

### Frontend Changes

1. Make your changes to the Next.js code in the `frontend/` directory
2. Run the deployment script again

### Backend Changes

1. Make your changes to the Python code in `functions/main.py`
2. Run the deployment script again

## Local Development

### Frontend

```bash
cd frontend
npm run dev
# or pnpm dev
```

### Backend

```bash
cd backend
python ar_backend.py
```

When running locally, the frontend will use the API endpoints at `http://127.0.0.1:5001/api/...` 
(configured in `lib/api-config.ts`).

## Troubleshooting

### Authentication Issues

If you experience authentication issues with Firebase:
1. Make sure you're logged in with `firebase login`
2. Check your Firebase project permissions

### API Connection Issues

If your frontend can't connect to the backend:
1. Check that the Firebase Functions are deployed successfully
2. Verify the API endpoints in `lib/api-config.ts`
3. Look at the Firebase Functions logs in the Firebase Console

### Firebase Resource Limits

Be aware that the free tier of Firebase has certain limits:
- Cloud Functions invocations
- Firestore read/writes
- Hosting bandwidth

Monitor your usage in the Firebase Console.
