/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import prisma from '../prisma.js';
import { createBookSchema, searchQuerySchema } from '../validation/bookSchema.js';
import logger from '../config/logger.js';
import verifyAdmin from '../middleware/adminAuth.js';
import { ZodError } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// GET /api/books?search=query
router.get('/', async (req, res) => {
  try {
    const validatedQuery = searchQuerySchema.parse(req.query);
    const search = validatedQuery.search || '';

    const books = await prisma.book.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    });

    logger.info(`Found ${books.length} books for search: "${search}"`);
    res.json(books);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Invalid search query:', error.issues);
      return res.status(400).json({ error: 'Invalid query parameters', details: error.issues });
    }
    logger.error('Failed to fetch books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST /api/books - Add a new book (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const validatedData = createBookSchema.parse(req.body);

    // Prefer raw MongoDB driver for create to avoid replica set transaction requirement
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    // Use default DB from the connection string
    const db = client.db();
    const collection = db.collection('Book');

    const now = new Date();
    const doc = { ...validatedData, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(doc);

    await client.close();

    const created = {
      id: result.insertedId.toString(),
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };
    logger.info(`Created new book: ${created.title} by ${created.author}`);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Invalid book data:', error.issues);
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    logger.error('Failed to add book:', {
      message: (error as any)?.message,
      name: (error as any)?.name,
    });
    const msg = (error as any)?.message || 'Failed to add book';
    res.status(500).json({ error: 'Failed to add book', message: msg });
  }
});

// PUT /api/books/:id - Update a book (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createBookSchema.partial().parse(req.body);

    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();

    const url = new URL(process.env.DATABASE_URL || 'mongodb://localhost:27017/bookstore');
    const dbName = url.pathname.replace(/^\//, '') || 'bookstore';
    const db = client.db(dbName);

    const collection = db.collection('books');

    let _id: ObjectId | string = id;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }

    const updateDoc: any = { ...validatedData };
    if (updateDoc.price !== undefined) updateDoc.price = Number(updateDoc.price);
    if (updateDoc.stock !== undefined) updateDoc.stock = Number(updateDoc.stock);
    updateDoc.updatedAt = new Date();

    console.log('Updating book on Render:', _id, updateDoc);

    const result = await collection.findOneAndUpdate(
      { _id },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    await client.close();

    if (!result.value) return res.status(404).json({ error: 'Book not found' });

    res.json({ id: result.value._id.toString(), ...result.value });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Failed to update book on Render:', error);
    res.status(500).json({ error: 'Failed to update book', message: (error as any)?.message });
  }
});

// DELETE /api/books/:id - Delete a book (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Use MongoDB driver to avoid Prisma transaction requirements
    const client = new MongoClient(process.env.DATABASE_URL || '');
    await client.connect();
    // Use default DB from connection string
    const db = client.db();
    const collection = db.collection('Book');

    const _id = new ObjectId(id);
    const result = await collection.deleteOne({ _id });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    logger.info(`Deleted book with id: ${id}`);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete book:', {
      message: (error as any)?.message,
      name: (error as any)?.name,
    });
    res.status(500).json({ error: 'Failed to delete book', message: (error as any)?.message });
  }
});

export default router;
