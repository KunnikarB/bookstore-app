import express from 'express';
import { checkoutCart } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', checkoutCart); // POST /api/checkout

export default router;
