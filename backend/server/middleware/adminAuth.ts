import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { ADMIN_EMAILS } from '../config/admins.js';

export default async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { email: decoded.email };

    // Check if user is admin
    if (!decoded.email || !ADMIN_EMAILS.includes(decoded.email)) {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.',
        userEmail: decoded.email,
      });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
