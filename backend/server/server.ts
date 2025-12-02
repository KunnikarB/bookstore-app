import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/Books.js';
import cartRoutes from './routes/Cart.js';
import checkoutRoutes from './routes/Checkout.js';
import logger from './config/logger.js';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { email?: string } | null;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Firebase Admin SDK now initialized from firebase.ts

app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('Bookstore API is running');
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore')
  .then(() => {
    logger.info('MongoDB connected successfully');
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });
