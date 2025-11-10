// src/api/cartApi.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/cart',
});

export const getCart = async () => {
  const res = await API.get('/');
  return res.data;
};

export const addToCart = async (bookId: string) => {
  const res = await API.post('/', { bookId });
  return res.data;
};

export const removeFromCart = async (bookId: string) => {
  const res = await API.delete(`/${bookId}`);
  if (res.status < 200 || res.status >= 300) throw new Error("Failed to remove item from cart");
  return res.data;
};


export const clearCart = async () => {
  const res = await API.delete('/clear');
  return res.data;
};

// NEW: update quantity
export const updateCartItem = async (bookId: string, quantity: number) => {
  const res = await API.put(`/${bookId}`, { quantity });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to update cart item');
  return res.data;
};