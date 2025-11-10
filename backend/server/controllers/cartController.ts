import type { Request, Response } from 'express';
import Book from '../models/Book.js';

let cart: { book: any; quantity: number }[] = [];

export const addToCart = async (req: Request, res: Response) => {
  const { bookId, quantity } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    // treat missing stock as 0 to avoid runtime and compile errors
    if ((book.stock ?? 0) < quantity)
      return res.status(400).json({ error: 'Not enough stock' });

    const existingItem = cart.find((item) => item.book._id.equals(book._id));
    if (existingItem) existingItem.quantity += quantity;
    else cart.push({ book, quantity });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const getCart = (_req: Request, res: Response) => {
  res.json(cart);
};

