import type { Request, Response } from 'express';
import prisma from '../prisma.js';

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({});
    res.json(books);
  } catch {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
