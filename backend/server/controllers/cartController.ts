import type { Request, Response } from 'express';
import Book from '../models/Book.js';
import Cart from '../models/Cart.js';

const USER_ID = 'demo-user';

export const addToCart = async (req: Request, res: Response) => {
  const { bookId, quantity = 1 } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if ((book.stock ?? 0) < quantity)
      return res.status(400).json({ error: 'Not enough stock' });

    let cart = await Cart.findOne({ userId: USER_ID }).populate('items.book');

    if (!cart) {
      cart = new Cart({ userId: USER_ID, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.book._id.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ book: book._id, quantity });
    }

    await cart.save();
    await cart.populate('items.book');
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const getCart = async (_req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: USER_ID }).populate('items.book');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const USER_ID = 'demo-user';

  try {
    const cart = await Cart.findOne({ userId: USER_ID });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    await cart.save();
    await cart.populate('items.book');
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};
