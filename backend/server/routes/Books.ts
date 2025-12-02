import express from 'express';
import prisma from '../prisma.js';
import { createBookSchema, searchQuerySchema } from '../validation/bookSchema.js';
import logger from '../config/logger.js';
import verifyAdmin from '../middleware/adminAuth.js';

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
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn('Invalid search query:', error);
      return res.status(400).json({ error: 'Invalid query parameters', details: error });
    }
    logger.error('Failed to fetch books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST /api/books - Add a new book (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const validatedData = createBookSchema.parse(req.body);

    const newBook = await prisma.book.create({
      data: validatedData,
    });

    logger.info(`Created new book: ${newBook.title} by ${newBook.author}`);
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn('Invalid book data:', error);
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
    logger.error('Failed to add book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT /api/books/:id - Update a book (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = createBookSchema.partial().parse(req.body);

    const updatedBook = await prisma.book.update({
      where: { id },
      data: validatedData,
    });

    logger.info(`Updated book: ${updatedBook.title} by ${updatedBook.author}`);
    res.json(updatedBook);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn('Invalid book data:', error);
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
    logger.error('Failed to update book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /api/books/:id - Delete a book (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id },
    });

    logger.info(`Deleted book with id: ${id}`);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
