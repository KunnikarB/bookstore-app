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
  clearCart: () => Promise<void>;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch cart from backend when app loads
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data.items || []); // ensure cart is always an array
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
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeItem = async (bookId: string) => {
    try {
      const updatedCart = await removeFromCartApi(bookId);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
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

  // Total price calculation
  const total =
    cart?.reduce((sum, item) => sum + item.book.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}
