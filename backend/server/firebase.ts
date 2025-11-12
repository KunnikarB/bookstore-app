// backend/server/firebase.ts
import admin from 'firebase-admin';
import { createRequire } from 'node:module';
import dotenv from 'dotenv';

dotenv.config();
const require = createRequire(import.meta.url);

if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'production') {
    console.log('⚙️ Using Firebase production credentials');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), // Google Cloud auto credentials
    });
  } else {
    console.log('⚙️ Using Firebase local credentials');
    const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

    if (!serviceAccountPath) {
      throw new Error('Missing FIREBASE_KEY_PATH in .env');
    }

    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export default admin;
