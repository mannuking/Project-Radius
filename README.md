# Project Radius

A comprehensive invoice management and tracking system built with Firebase.

## Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable the following Firebase services:
   - Authentication
   - Firestore Database
   - Storage (if needed for file uploads)
   - Hosting (for deployment)

3. Configure Firebase in your frontend:
   ```javascript
   // src/firebase.js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

## Features

- User Authentication (Firebase Auth)
- Invoice Management (Firestore)
- Aging Reports
- Action Tracking
- Promise-to-Pay (PTP) Management
- Audit Trail
- Role-based Access Control

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Deployment

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Security Rules

Make sure to set up appropriate security rules in Firebase Console for:
- Firestore Database
- Storage
- Authentication

Example Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /invoices/{invoiceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## API Documentation

API documentation is available at `/api-docs` when running the server. 
