import axios from 'axios';
import { auth } from '../firebase';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Add Firebase auth token to all requests
API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getBooks = async (query?: string) => {
  try {
    const res = await API.get('/books', {
      params: query ? { search: query } : {},
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const addToCart = (bookId: string, quantity: number) =>
  API.post('/cart', { bookId, quantity });

export const getCart = () => API.get('/cart');

export const addBook = (bookData: {
  title: string;
  author: string;
  price: number;
  stock: number;
}) => API.post('/books', bookData);

export const updateBook = (
  id: string,
  bookData: Partial<{
    title: string;
    author: string;
    price: number;
    stock: number;
  }>
) => API.put(`/books/${id}`, bookData);

export const deleteBook = (id: string) => API.delete(`/books/${id}`);
