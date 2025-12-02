import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .optional()
    .default(0),
});

export const updateBookSchema = createBookSchema.partial();

export const searchQuerySchema = z.object({
  search: z.string().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
