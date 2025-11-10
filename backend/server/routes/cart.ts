import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemController,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.delete('/:bookId', removeFromCart);
router.put('/:bookId', updateCartItemController);

export default router;
