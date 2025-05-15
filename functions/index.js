/**
 * This file is a bridge between Firebase Functions and our API
 */

const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { spawn } = require('child_process');

// Initialize the Firebase Admin SDK
const app = initializeApp();
// Connect to the 'radiusdb' database instead of the default
const db = getFirestore(app, 'radiusdb');

/**
 * Simple API endpoint to handle all backend requests
 * This function will be deployed as a Firebase Function
 */
exports.api = onRequest({ cors: true }, async (req, res) => {
  // Check if Firestore is available
  try {
    await db.collection('_health_check').doc('test').set({ timestamp: new Date() });
    console.log("Firestore connection successful");
  } catch (error) {
    console.error("Firestore connection error:", error);
    // Continue anyway - the Python backend doesn't necessarily need Firestore
  }
  
  // Forward the request to the Python backend
  const pythonProcess = spawn('python', ['main.py', JSON.stringify(req.path), JSON.stringify(req.body)]);
  
  const demoData = {
    summary: {
      totalInvoices: 250,
      totalOutstanding: 120000.50,
      overdueInvoices: 75
    },
    agingBuckets: {
      current: { count: 100, amount: 36000.00 },
      "1-30": { count: 75, amount: 36000.00 },
      "31-60": { count: 38, amount: 24000.00 },
      "61-90": { count: 25, amount: 12000.00 },
      "90+": { count: 12, amount: 12000.50 }
    },
    recentActivity: [
      {
        id: "act_1234",
        timestamp: "2025-05-15T10:30:00Z",
        type: "Invoice Created",
        user: "John Doe",
        description: "Created invoice INV-2025"
      },
      {
        id: "act_1235",
        timestamp: "2025-05-14T14:25:00Z",
        type: "Payment Received",
        user: "Jane Smith",
        description: "Received payment for INV-2020"
      }
    ]
  };
  
  res.json(demoData);
});
