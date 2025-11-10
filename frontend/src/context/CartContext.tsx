/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  updateCartItem as updateCartItemApi, // new backend endpoint to update quantity
} from '../api/cartApi';

type Book = {
  _id: string;
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setCart([]);
      }
    };
    fetchCart();
  }, []);

  const addItem = async (bookId: string) => {
    try {
      const updatedCart = await addToCartApi(bookId);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const removeItem = async (bookId: string) => {
    try {
      const updatedCart = await removeFromCartApi(bookId);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // New: update quantity
  const updateQuantity = async (bookId: string, quantity: number) => {
    try {
      const updatedCart = await updateCartItem(bookId, quantity);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };


  const clearCart = async () => {
    try {
      await clearCartApi();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
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
