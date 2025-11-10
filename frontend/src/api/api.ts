 
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getBooks =  async (query?: string) => {
  try {
  const res = await API.get('/books', { params: query ? { search: query } : {} });
  return res.data;
} catch (error) {
  console.error('Error fetching books:', error);
  return [];
  }
};

export const addToCart = (bookId: string, quantity: number) =>
  API.post('/cart', { bookId, quantity });

export const getCart = () => API.get('/cart');
