import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Auth failed: No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { email: decoded.email };
    console.log('✅ Token verified for:', decoded.email);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
