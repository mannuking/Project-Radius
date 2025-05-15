# Project Radius Firebase Deployment - Comprehensive Fix

This document outlines the comprehensive solution to fix the Firebase deployment issues for Project Radius, particularly focusing on the Firestore database connection with the custom 'radiusdb' database.

## Summary of Fixes

1. **Database Configuration**
   - Updated Firebase Functions to connect to the custom 'radiusdb' database
   - Modified Python backend to use the correct database reference
   - Added more robust error handling for database connectivity issues

2. **API Configuration**
   - Enhanced API config to prevent caching issues
   - Added error handling specific to Firebase connection problems
   - Fixed URL handling for both development and production environments

3. **Deployment Process**
   - Created specialized deployment script (`deploy-with-custom-db.ps1`) 
   - Added diagnostic tools to verify correct configuration
   - Added testing scripts for local development and API verification

4. **Error Handling**
   - Added enhanced error boundary with Firebase-specific detection
   - Implemented client-side cache clearing functionality
   - Added detailed error messages to help troubleshoot common issues

## Solution Files Created

1. `deploy-with-custom-db.ps1` - Deploy script that explicitly uses the 'radiusdb' database
2. `diagnose-deployment.ps1` - Script to check Firebase configuration
3. `test-functions-local.ps1` - Test Firebase Functions locally
4. `test-api.ps1` - Test API connectivity (both local and deployed)
5. `FIRESTORE_DATABASE_FIX.md` - Detailed guide for fixing Firestore issues

## Code Changes Applied

### 1. Functions/index.js

Modified the Firestore initialization to explicitly use 'radiusdb':

```js
// Initialize the Firebase Admin SDK
const app = initializeApp();
// Connect to the 'radiusdb' database instead of the default
const db = getFirestore(app, 'radiusdb');
```

### 2. Functions/main.py

Updated Python initialization to use the correct database:

```python
# Initialize Firebase app with specific database
initialize_app(options={'databaseURL': 'https://ar-tracker-c226f.firebaseio.com', 
                       'projectId': 'ar-tracker-c226f', 
                       'databaseInstance': 'radiusdb'})
```

### 3. Frontend/lib/api-config.ts

Improved API configuration with cache-busting:

```typescript
// Helper function to get full URL for an endpoint
getUrl: (endpoint: string, queryParams: Record<string, string> = {}) => {
  // ...existing code...
  
  // Add a timestamp to prevent caching issues in production
  if (!isDevelopment) {
    params.append('_t', Date.now().toString());
  }
  
  // ...existing code...
}
```

### 4. ErrorBoundary.tsx

Enhanced error handling for Firebase-specific issues:

```tsx
// Check for Firebase-specific errors
const errorMessage = this.state.error?.message || 'An unexpected error occurred';
const isFirebaseError = errorMessage.includes('Firebase') || errorMessage.includes('firestore');

// Special handling for Firebase errors
// ...
```

## How to Apply the Fix

1. First run the diagnostic tool:
   ```powershell
   .\diagnose-deployment.ps1
   ```

2. Deploy with the custom database script:
   ```powershell
   .\deploy-with-custom-db.ps1
   ```

3. Test the API connectivity:
   ```powershell
   .\test-api.ps1
   ```

4. If issues persist, try local testing:
   ```powershell
   .\test-functions-local.ps1
   ```

5. In another terminal, test the local API:
   ```powershell
   .\test-api.ps1 -Local
   ```

## Common Issues and Solutions

### 1. "Project or database does not exist" Error

**Solution:**
- Make sure your Firebase project has the custom database 'radiusdb' created
- Check Firebase console to verify database exists
- Run: `firebase firestore:databases:create --database=radiusdb --location=us-central`

### 2. Website Not Loading or Infinite Loading

**Solution:**
- Clear browser cache completely (Ctrl+Shift+Delete in most browsers)
- Check browser console for specific errors
- Verify Firebase Functions are properly deployed with `firebase functions:log`
- Use the enhanced ErrorBoundary's "Clear Cache & Refresh Page" button

### 3. Network Requests Not Completing

**Solution:**
- Check for CORS issues in browser console
- Verify API base URL configuration in api-config.ts
- Make sure firebase.json has the correct rewrite rules
- Check for any Firebase quota limits or billing issues

## Verification Steps

After deploying, verify success by:

1. Opening the deployed site (check Firebase console for URL)
2. Checking Network tab in browser DevTools - API calls should complete successfully
3. Ensuring no Firebase-related errors appear in the console
4. Testing the core functionality of loading accounts receivable data

## Additional Resources

For more detailed Firebase troubleshooting:
- See `FIRESTORE_DATABASE_FIX.md` for database-specific issues
- Firebase documentation: https://firebase.google.com/docs
- Firebase Cloud Functions logs: `firebase functions:log`
