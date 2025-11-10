import type { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import Book from '../models/Book.js';

const USER_ID = 'demo-user'; // for simplicity

// Get cart
export const getCart = async (_req: Request, res: Response) => {
  const cart = await Cart.findOne({ userId: USER_ID }).populate('items.book');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add item
export const addToCart = async (req: Request, res: Response) => {
  const { bookId, quantity = 1 } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  let cart = await Cart.findOne({ userId: USER_ID });
  if (!cart) cart = new Cart({ userId: USER_ID, items: [] });

  const existingItem = cart.items.find((i) => i.book.equals(book._id));
  if (existingItem) existingItem.quantity += quantity;
  else cart.items.push({ book: book._id, quantity });

  await cart.save();
  await cart.populate('items.book');
  res.json(cart);
};

// Remove item
export const removeFromCart = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  let cart = await Cart.findOne({ userId: USER_ID });
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  cart.items = cart.items.filter((i) => i.book.toString() !== bookId);
  await cart.save();
  await cart.populate('items.book');
  res.json(cart);
};

// Clear cart
export const clearCart = async (_req: Request, res: Response) => {
  let cart = await Cart.findOne({ userId: USER_ID });
  if (!cart) cart = new Cart({ userId: USER_ID, items: [] });
  cart.items = [];
  await cart.save();
  res.json(cart);
};
