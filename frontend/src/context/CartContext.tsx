/* eslint-disable react-refresh/only-export-components */
/* @refresh reload */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  updateCartItem as updateCartItemApi, // new backend endpoint to update quantity
} from '../api/cartApi';

import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

type Book = {
  id: string;
  title: string;
  price: number;
  stock?: number;
};

type CartItem = {
  book: Book;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (bookId: string) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>; // new
  clearCart: () => Promise<void>;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      // Only fetch cart if user is authenticated
      if (!user) {
        setCart([]);
        return;
      }

      try {
        const data = await getCart();
        setCart(data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

  const addItem = async (bookId: string) => {
    if (!user) {
      toast.error('Please log in to add items');
      navigate('/login');
      return;
    }
    if (!bookId) {
      toast.error('Invalid book. Please refresh.');
      return;
    }
    try {
      const updatedCart = await addToCartApi(bookId);
      setCart(updatedCart.items || []);
      toast.success('Item added to cart 🛍️');
    } catch (error) {
      console.error('Failed to add item:', error);
      const status = (error as any)?.response?.status;
      if (status === 401) {
        toast.error('Unauthorized. Please log in again.');
        navigate('/login');
      } else if (status === 404) {
        toast.error('Book not found. Refresh books.');
      } else {
        toast.error('Failed to add item ❌');
      }
    }
  };

  const removeItem = async (bookId: string) => {
    if (!user) {
      toast.error('Please log in to manage your cart');
      return;
    }
    if (!bookId) {
      toast.error('Invalid item. Please refresh.');
      return;
    }
    try {
      const updatedCart = await removeFromCartApi(bookId);
      setCart(updatedCart.items || []);
      toast('Item removed from cart', { icon: '🗑️' });
    } catch (error) {
      console.error('Failed to remove item:', error);
      const status = (error as any)?.response?.status;
      if (status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else {
        toast.error('Failed to remove item ❌');
      }
    }
  };

  // New: update quantity
  const updateQuantity = async (bookId: string, quantity: number) => {
    if (!user) {
      toast.error('Please log in to update quantities');
      return;
    }
    if (!bookId) {
      toast.error('Invalid item. Please refresh.');
      return;
    }
    if (quantity <= 0) {
      await removeItem(bookId);
      toast('Item removed', { icon: '➖' });
      return;
    }
    try {
      const updatedCart = await updateCartItemApi(bookId, quantity);
      setCart(updatedCart.items || []);
      toast.success(`📦 Quantity updated to ${quantity}`);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      const status = (err as any)?.response?.status;
      if (status === 400) {
        toast.error('Not enough stock');
      } else if (status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else if (status === 404) {
        toast.error('Book not found in cart');
      } else {
        toast.error('Update failed ❌');
      }
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      setCart([]);
      toast('Cart cleared', { icon: '🧹' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart ❌');
    }
  };

  const total =
    cart?.reduce((sum, item) => sum + item.book.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}
