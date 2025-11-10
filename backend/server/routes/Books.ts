import express from 'express';
import Book from '../models/Book.ts';

const router = express.Router();

// GET /api/books?search=query
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search as string) || '';
    const books = await Book.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

export default router;
