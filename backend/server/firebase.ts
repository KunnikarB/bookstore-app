// backend/server/firebase.ts
import admin from 'firebase-admin';
import { createRequire } from 'node:module';
import dotenv from 'dotenv';

dotenv.config();
const require = createRequire(import.meta.url);

if (!admin.apps.length) {
  // Try Firebase credentials from environment variable first (for Render)
  if (process.env.FIREBASE_CREDENTIALS_JSON) {
    console.log('⚙️ Using Firebase credentials from environment variable');
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Failed to parse FIREBASE_CREDENTIALS_JSON:', error);
      throw error;
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.log('⚙️ Using Firebase production credentials (applicationDefault)');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    // Local development: read from file path
    console.log('⚙️ Using Firebase local credentials from file');
    const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

    if (!serviceAccountPath) {
      throw new Error('Missing FIREBASE_KEY_PATH in .env or FIREBASE_CREDENTIALS_JSON');
    }

    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export default admin;
