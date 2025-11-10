import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.delete('/:bookId', removeFromCart);

export default router;
