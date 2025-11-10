import type { Request, Response } from 'express';
import Book from '../models/Book.js';

let cart: { book: any; quantity: number }[] = []; // your in-memory cart

export const checkoutCart = async (req: Request, res: Response) => {
  try {
    const { cart, discountCode } = req.body;

    if (!Array.isArray(cart) || !cart.length)
      return res.status(400).json({ error: 'Cart is empty' });

    for (const item of cart) {
      const book = await Book.findById(item.book._id);
      if (!book)
        return res.status(404).json({ error: `${item.book.title} not found` });

      if (typeof book.stock !== 'number')
        return res
          .status(500)
          .json({ error: `Stock info missing for ${book.title}` });

      if (book.stock < item.quantity)
        return res
          .status(400)
          .json({ error: `${book.title} does not have enough stock` });

      book.stock -= item.quantity;
      await book.save();
    }

    // Calculate total
    let total = cart.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );

    // Apply discount rules
    if (discountCode === 'SAVE10') total *= 0.9;
    if (discountCode === 'SAVE20') total *= 0.8;
    if (total > 300) total *= 0.7; // 30% off for orders > $300

    // Prevent negative total
    if (total < 0) total = 0;

    const orderId = `TXN-${Math.floor(Math.random() * 10000)}`;

    return res.json({
      message: 'Purchase completed successfully',
      total: total.toFixed(2),
      orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
};


