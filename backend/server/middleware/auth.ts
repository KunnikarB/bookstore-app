import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Auth failed: No token provided');
    console.log('📝 Authorization header:', authHeader ? 'Present' : 'Missing');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔍 Verifying token, length:', token.length);

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { email: decoded.email };
    console.log('✅ Token verified for:', decoded.email);
    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Token verification failed:', errorMessage);
    console.error('Full error:', error);
    res.status(401).json({ message: 'Invalid token', error: errorMessage });
  }
}
