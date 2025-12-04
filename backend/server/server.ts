import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/Books.js';
import cartRoutes from './routes/Cart.js';
import checkoutRoutes from './routes/Checkout.js';
import logger from './config/logger.js';
import prisma from './prisma.js';
import verifyToken from './middleware/auth.js';
import './firebase.js'; // Initialize Firebase Admin SDK

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { email?: string } | null;
    }
  }
}

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://*.vercel.app',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((allowed) => {
          if (allowed.includes('*')) {
            return origin.endsWith(allowed.replace('*', ''));
          }
          return origin === allowed;
        })
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Public routes (no auth required)
app.use('/api/books', bookRoutes);

// Protected routes (require authentication)
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/checkout', verifyToken, checkoutRoutes);

app.get('/', (req, res) => {
  res.send('Bookstore API is running');
});

const PORT = process.env.PORT || 3000;

// Connect to Prisma
prisma
  .$connect()
  .then(() => {
    logger.info('Prisma connected to MongoDB successfully');
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    logger.error('Prisma connection error:', err);
    process.exit(1);
  });
