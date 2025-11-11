import express from 'express';
import Book from '../models/Book.js';

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

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBook = new Book({ title, author, price, stock });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Failed to add book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});


export default router;
