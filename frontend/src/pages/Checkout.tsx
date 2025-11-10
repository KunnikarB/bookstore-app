/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutCart } from '../api/checkoutapi';
import type { Book } from '../types';

export default function Checkout() {
  const { cart, total, clearCart, addItem, removeItem, updateQuantity } =
    useCart();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [books, setBooks] = useState<Book[]>([]); // Available books to add

  // Fetch available books for “Add More Items”
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/books'); // backend books endpoint
        const data = await res.json();
        setBooks(data || []);
      } catch (err) {
        console.error('Failed to fetch books', err);
      }
    };
    fetchBooks();
  }, []);

  // Calculate discounted total
  const discountedTotal = useMemo(() => {
    if (!total) return 0;
    let newTotal = total;
    if (discountCode === 'SAVE10') newTotal *= 0.9;
    if (discountCode === 'SAVE20') newTotal *= 0.8;
    if (newTotal >= 300) newTotal *= 0.7; // 30% off for orders > $300
    return newTotal > 0 ? newTotal : 0;
  }, [total, discountCode]);

  // Handle checkout
  const handleCheckout = async () => {
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await checkoutCart(cart, discountCode);
      setMessage(`✅ ${data.message}. Total: $${data.total}`);
      clearCart();
      setDiscountCode('');
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return <p>Your cart is empty</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Checkout</h2>

      {/* Cart Items */}
      <ul>
        {cart.map((item) => (
          <li
            key={item.book._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div>
              {item.book.title} - ${item.book.price} × {item.quantity}
            </div>

            <div>
              {/* Increase quantity */}
              <button
                onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                style={{ marginRight: '5px' }}
              >
                +
              </button>

              {/* Decrease quantity */}
              <button
                onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                style={{ marginRight: '5px' }}
              >
                -
              </button>

              {/* Cancel/remove item */}
              <button onClick={() => removeItem(item.book._id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <p>Subtotal: ${total?.toFixed(2) || 0}</p>

      {/* Discount code input */}
      <div style={{ margin: '10px 0' }}>
        <input
          type="text"
          placeholder="Discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.trim().toUpperCase())}
          style={{ padding: '5px', width: '60%' }}
        />
      </div>

      <p>
        <strong>Total after discount:</strong> ${discountedTotal.toFixed(2)}
      </p>

      {/* Checkout buttons */}
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>

        <button
          onClick={clearCart}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          Cancel All
        </button>
      </div>

      {message && (
        <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>
      )}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />

      {/* Add More Items Section */}
      <h3>Add More Items</h3>
      <ul>
        {books.map((book) => (
          <li key={book._id} style={{ marginBottom: '5px' }}>
            {book.title} - ${book.price}{' '}
            <button onClick={() => addItem(book._id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
