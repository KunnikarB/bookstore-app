/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const USER_ID = 'demo-user';

// Get cart
export const getCart = async (_req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const carts = db.collection('Cart');
    const books = db.collection('Book');

    const cartDoc = await carts.findOne({ userId: USER_ID });
    if (!cartDoc) {
      await client.close();
      return res.json({ items: [] });
    }

    // Join book details
    const items = await Promise.all(
      (cartDoc.items || []).map(async (item: any) => {
        const book = await books.findOne({ _id: new ObjectId(item.bookId) });
        return {
          book: book
            ? {
                id: book._id.toString(),
                title: book.title,
                author: book.author,
                price: book.price,
                stock: book.stock,
              }
            : null,
          quantity: item.quantity,
        };
      })
    );

    await client.close();
    res.json({ items: items.filter((i) => i.book) });
  } catch (err) {
    console.error('Failed to fetch cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const carts = db.collection('Cart');
    const books = db.collection('Book');

    const book = await books.findOne({ _id: new ObjectId(bookId) });
    if (!book) {
      await client.close();
      return res.status(404).json({ error: 'Book not found' });
    }

    await carts.updateOne(
      { userId: USER_ID },
      {
        $setOnInsert: { userId: USER_ID, items: [] },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    // Try to increment quantity if item exists
    const incResult = await carts.updateOne(
      { userId: USER_ID, 'items.bookId': bookId },
      { $inc: { 'items.$.quantity': quantity }, $set: { updatedAt: new Date() } }
    );

    if (incResult.matchedCount === 0) {
      // Push new item
      await carts.updateOne(
        { userId: USER_ID },
        {
          $push: { items: { bookId, quantity } } as any,
          $set: { updatedAt: new Date() },
        }
      );
    }

    // Return updated cart
    const cartDoc = await carts.findOne({ userId: USER_ID });
    const items = await Promise.all(
      (cartDoc?.items || []).map(async (item: any) => {
        const b = await books.findOne({ _id: new ObjectId(item.bookId) });
        return {
          book: b
            ? {
                id: b._id.toString(),
                title: b.title,
                author: b.author,
                price: b.price,
                stock: b.stock,
              }
            : null,
          quantity: item.quantity,
        };
      })
    );

    await client.close();
    res.json({ items: items.filter((i) => i.book) });
  } catch (err) {
    console.error('Failed to add to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Remove item
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const carts = db.collection('Cart');
    const books = db.collection('Book');

    await carts.updateOne(
      { userId: USER_ID },
      { $pull: { items: { bookId } } as any, $set: { updatedAt: new Date() } }
    );

    const cartDoc = await carts.findOne({ userId: USER_ID });
    const items = await Promise.all(
      (cartDoc?.items || []).map(async (item: any) => {
        const b = await books.findOne({ _id: new ObjectId(item.bookId) });
        return {
          book: b
            ? {
                id: b._id.toString(),
                title: b.title,
                author: b.author,
                price: b.price,
                stock: b.stock,
              }
            : null,
          quantity: item.quantity,
        };
      })
    );

    await client.close();
    res.json({ items: items.filter((i) => i.book) });
  } catch (err) {
    console.error('Failed to remove from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Clear cart
export const clearCart = async (_req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const carts = db.collection('Cart');

    await carts.updateOne(
      { userId: USER_ID },
      { $set: { items: [], updatedAt: new Date() } },
      { upsert: true }
    );

    const cartDoc = await carts.findOne({ userId: USER_ID });
    await client.close();
    res.json({ items: cartDoc?.items || [] });
  } catch (err) {
    console.error('Failed to clear cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { quantity } = req.body;

  try {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    const db = client.db();
    const carts = db.collection('Cart');
    const books = db.collection('Book');

    const book = await books.findOne({ _id: new ObjectId(bookId) });
    if (!book) {
      await client.close();
      return res.status(404).json({ error: 'Book not found' });
    }

    if (quantity <= 0) {
      await carts.updateOne(
        { userId: USER_ID },
        { $pull: { items: { bookId } } as any, $set: { updatedAt: new Date() } }
      );
    } else {
      const available = book.stock ?? Infinity;
      if (available < quantity) {
        await client.close();
        return res.status(400).json({ error: 'Not enough stock' });
      }
      const updateExisting = await carts.updateOne(
        { userId: USER_ID, 'items.bookId': bookId },
        { $set: { 'items.$.quantity': quantity, updatedAt: new Date() } }
      );
      if (updateExisting.matchedCount === 0) {
        await carts.updateOne(
          { userId: USER_ID },
          { $push: { items: { bookId, quantity } } as any, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }
    }

    const cartDoc = await carts.findOne({ userId: USER_ID });
    const items = await Promise.all(
      (cartDoc?.items || []).map(async (item: any) => {
        const b = await books.findOne({ _id: new ObjectId(item.bookId) });
        return {
          book: b
            ? {
                id: b._id.toString(),
                title: b.title,
                author: b.author,
                price: b.price,
                stock: b.stock,
              }
            : null,
          quantity: item.quantity,
        };
      })
    );

    await client.close();
    res.json({ items: items.filter((i) => i.book) });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};
