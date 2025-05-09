#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Define the path to the .env.local file
const envPath = path.join(__dirname, '.env.local')

// Template for the .env.local file
const envTemplate = `# Firebase client config (for frontend use)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAw8XF5kK0hD_vV33n2VnRGVmAlP98Fcxw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ar-tracker-c226f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ar-tracker-c226f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ar-tracker-c226f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682110029066
NEXT_PUBLIC_FIREBASE_APP_ID=1:682110029066:web:53acb495181020913d3ef3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NKB12LW8VN

# Enable Firebase Auth
NEXT_PUBLIC_USE_FIREBASE_AUTH=true

# Firebase Admin SDK (for backend/middleware use)
FIREBASE_PROJECT_ID=ar-tracker-c226f
FIREBASE_CLIENT_EMAIL=REPLACE_WITH_SERVICE_ACCOUNT_EMAIL
FIREBASE_PRIVATE_KEY=REPLACE_WITH_PRIVATE_KEY
`

console.log('AR Manager - Setup Script')
console.log('=========================')
console.log('')
console.log('This script will help you set up your environment for the AR Manager application.')
console.log('')
console.log('You need to provide:')
console.log('1. Your Firebase Service Account Email')
console.log('2. Your Firebase Private Key')
console.log('')
console.log('You can find these in your Firebase Console under:')
console.log('Project Settings > Service Accounts > Generate new private key')
console.log('')

rl.question('Enter your Firebase Service Account Email: ', (clientEmail) => {
  rl.question('Enter your Firebase Private Key (entire key with BEGIN and END lines): ', (privateKey) => {
    // Process the private key to escape newlines
    const escapedPrivateKey = privateKey.replace(/\n/g, '\\n')
    
    // Create the .env.local file with the provided values
    const envContent = envTemplate
      .replace('REPLACE_WITH_SERVICE_ACCOUNT_EMAIL', clientEmail)
      .replace('REPLACE_WITH_PRIVATE_KEY', escapedPrivateKey)
    
    fs.writeFileSync(envPath, envContent)
    
    console.log('')
    console.log('✅ Environment file (.env.local) has been created successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run `npm install` or `pnpm install` to install dependencies')
    console.log('2. Run `npm run dev` or `pnpm run dev` to start the application')
    console.log('')
    
    rl.close()
  })
})

rl.on('close', () => {
  process.exit(0)
}) 
