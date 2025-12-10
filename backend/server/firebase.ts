import admin from 'firebase-admin';
import { createRequire } from 'node:module';
import dotenv from 'dotenv';

dotenv.config();
const require = createRequire(import.meta.url);

if (!admin.apps.length) {
  console.log('Initializing Firebase Admin...');

  try {
    if (process.env.FIREBASE_CREDENTIALS_JSON?.trim()) {
      console.log('Using Firebase credentials from FIREBASE_CREDENTIALS_JSON');
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.FIREBASE_KEY_PATH?.trim()) {
      console.log(' Using Firebase credentials from local file:', process.env.FIREBASE_KEY_PATH);
      const serviceAccount = require(process.env.FIREBASE_KEY_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin initialized from local file');
    } else {
      console.log('Using Firebase application default credentials');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

export default admin;
