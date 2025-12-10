import axios from 'axios';
import { auth } from '../firebase';
import { API_BASE } from './apiBase';

const API = axios.create({
  baseURL: API_BASE,
});

// Add Firebase auth token to all requests
API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Force refresh to ensure token is valid
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to get auth token:', error);
        // Don't block the request, let backend handle unauthorized
      }
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
