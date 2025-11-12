import admin from 'firebase-admin';

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    console.log('Verified user:', decoded.email);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).send('Invalid token');
  }
}

export default verifyToken;
