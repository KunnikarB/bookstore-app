// src/api/cartApi.ts
import axios from 'axios';
import { auth } from '../firebase';
import { API_BASE } from './apiBase';

const API = axios.create({
  baseURL: `${API_BASE}/cart`,
});

// Add Firebase auth token to all cart requests
API.interceptors.request.use(
  async (config) => {
    console.log('🔍 Cart API: Waiting for auth...');
    
    // Wait for auth to be ready
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(() => {
        unsubscribe();
        resolve(undefined);
      });
    });

    const user = auth.currentUser;
    console.log('🔍 Cart API: Current user:', user?.email || 'Not logged in');
    
    if (user) {
      try {
        // Force refresh to ensure token is valid
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Cart API: Token attached');
      } catch (error) {
        console.error('❌ Cart API: Failed to get auth token:', error);
      }
    } else {
      console.warn('⚠️ Cart API: No user logged in, request will fail');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  if (res.status < 200 || res.status >= 300)
    throw new Error('Failed to remove item from cart');
  return res.data;
};

export const clearCart = async () => {
  const res = await API.delete('/clear');
  return res.data;
};

// NEW: update quantity
export const updateCartItem = async (bookId: string, quantity: number) => {
  const res = await API.put(`/${bookId}`, { quantity });
  if (res.status < 200 || res.status >= 300)
    throw new Error('Failed to update cart item');
  return res.data;
};
