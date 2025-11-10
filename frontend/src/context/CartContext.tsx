/* eslint-disable react-refresh/only-export-components */
 
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
import toast from 'react-hot-toast';


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
      toast.success('Item added to cart 🛍️');
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item ❌');
    }
  };


  const removeItem = async (bookId: string) => {
    try {
      const updatedCart = await removeFromCartApi(bookId);
      setCart(updatedCart.items || []);
      toast('Item removed from cart', { icon: '🗑️' });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item ❌');
    }
  };


  // New: update quantity
  const updateQuantity = async (bookId: string, quantity: number) => {
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
      toast.error('Update failed ❌');
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
