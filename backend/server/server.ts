import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
// @ts-ignore: implicit any for JS module without declaration file
import verifyToken from './middleware/auth.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/Books.js';
import cartRoutes from './routes/Cart.js';
import checkoutRoutes from './routes/Checkout.js';

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('Bookstore API is running');
});

app.get('/secure-data', verifyToken, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.user?.email ?? null,
    list: ['secret1', 'secret2', 'secret3'],
  });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
