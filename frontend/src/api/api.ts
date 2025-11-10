/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getBooks = (query?: string) =>
  API.get('/books').then((res) => {
    if (!query) return res.data;
    return res.data.filter((book: any) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  });

export const addToCart = (bookId: string, quantity: number) =>
  API.post('/cart', { bookId, quantity });

export const getCart = () => API.get('/cart');
