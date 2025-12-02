import type { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

interface CartItem {
  book: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

export const checkoutCart = async (req: Request, res: Response) => {
  try {
    const { cart, discountCode }: { cart: CartItem[]; discountCode?: string } = req.body;

    if (!Array.isArray(cart) || !cart.length)
      return res.status(400).json({ error: 'Cart is empty' });

    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const booksCol = db.collection('Book');

    for (const item of cart) {
      const _id = new ObjectId(item.book.id);
      const book = await booksCol.findOne({ _id });
      if (!book) {
        await client.close();
        return res.status(404).json({ error: `${item.book.title} not found` });
      }

      const currentStock = typeof book.stock === 'number' ? book.stock : Infinity;
      if (currentStock < item.quantity) {
        await client.close();
        return res.status(400).json({ error: `${book.title} does not have enough stock` });
      }

      await booksCol.updateOne(
        { _id },
        { $set: { stock: currentStock - item.quantity, updatedAt: new Date() } }
      );
    }

    // Calculate total
    let total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    // Apply discount rules
    if (discountCode === 'SAVE10') total *= 0.9;
    if (discountCode === 'SAVE20') total *= 0.8;
    if (total > 300) total *= 0.7; // 30% off for orders > $300

    // Prevent negative total
    if (total < 0) total = 0;

    const orderId = `TXN-${Math.floor(Math.random() * 10000)}`;

    await client.close();
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
