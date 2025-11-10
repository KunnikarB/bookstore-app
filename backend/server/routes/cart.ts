import express from 'express';
import { addToCart, getCart } from '../controllers/cartController.ts';

const router = express.Router();

router.post('/', addToCart);
router.get('/', getCart);


export default router;
