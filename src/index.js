const functions = require("firebase-functions");
const app = require("./app");

// Export the Express app as a Firebase Function
exports.api = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 60,
    secrets: ["FIREBASE_API_KEY", "FIREBASE_PROJECT_ID", "FIREBASE_APP_ID"],
  })
  .https.onRequest(app);
