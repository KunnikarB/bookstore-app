import type { Request, Response } from 'express';
import Book from '../models/Book.ts';

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
