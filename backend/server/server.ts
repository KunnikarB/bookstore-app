import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/Books.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/Checkout.js';
import logger from './config/logger.js';
import prisma from './prisma.js';
import verifyToken from './middleware/auth.js';
import './firebase.js';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { email?: string } | null;
    }
  }
}

const app = express();

// CORS (Render compatible)
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookstore-app-1-uhqx.onrender.com',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server or curl
      const isRender = origin.includes('.onrender.com');
      if (allowedOrigins.includes(origin) || isRender) {
        return callback(null, true);
      }
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Public routes
app.use('/api/books', bookRoutes);

// Protected routes
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/checkout', verifyToken, checkoutRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Bookstore API is running');
});

const PORT = process.env.PORT || 3000;

prisma
  .$connect()
  .then(() => {
    logger.info('Prisma connected to MongoDB successfully');
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Prisma connection error:', err);
    process.exit(1);
  });
