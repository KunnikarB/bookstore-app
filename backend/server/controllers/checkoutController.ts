import type { Request, Response } from 'express';
import Book from '../models/Book.js';

let cart: { book: any; quantity: number }[] = []; // your in-memory cart

export const checkoutCart = async (req: Request, res: Response) => {
  try {
    console.log('Received cart:', req.body.cart); // DEBUG

    const cart = req.body.cart;

    if (!Array.isArray(cart) || !cart.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cart) {
      const book = await Book.findById(item.book._id);
      if (!book)
        return res.status(404).json({ error: `${item.book.title} not found` });

      if (typeof book.stock !== 'number')
        return res
          .status(500)
          .json({ error: `Stock information missing for ${book.title}` });

      if (book.stock < item.quantity)
        return res
          .status(400)
          .json({ error: `${book.title} does not have enough stock` });

      book.stock -= item.quantity;
      await book.save();
    }

    const total = cart.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const orderId = `TXN-${Math.floor(Math.random() * 10000)}`;

    return res.json({
      message: 'Purchase completed successfully',
      total,
      orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
};

