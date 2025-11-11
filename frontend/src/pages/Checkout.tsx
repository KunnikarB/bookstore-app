/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutCart } from '../api/checkoutapi';
import '../index.css';

type Book = {
  _id: string;
  title: string;
  author?: string;
  price: number;
  stock?: number;
};

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

  if (!cart.length) return <p style={{ color: 'hotpink', fontWeight: 'bold', maxWidth: '700px', margin: '20px auto', fontSize: '1.2rem' }}>Your cart is empty</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>Checkout</h2>

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
              borderBottom: '1px solid #6c46dd',
              color: 'hotpink',
            }}
          >
            <div>
              {item.book.title} - ${item.book.price} × {item.quantity}
            </div>

            <div>
              {/* Increase quantity */}
              <button
                onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                style={{ marginRight: '5px', backgroundColor: '#6c46dd', color: 'white', border: 'none', borderRadius: '4px', padding: '0.1rem 0.6rem', cursor: 'pointer' }}
              >
                +
              </button>

              {/* Decrease quantity */}
              <button
                onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                style={{ marginRight: '5px', backgroundColor: 'hotpink', color: 'white', border: 'none', borderRadius: '4px', padding: '0.1rem 0.6rem', marginBottom: '0.3rem', cursor: 'pointer' }}
              >
                -
              </button>

              {/* Cancel/remove item */}
              <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }} onClick={() => removeItem(item.book._id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <p style={{ color: '#fff', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Subtotal: <strong style={{color: 'hotpink'}}>${total?.toFixed(2) || 0}</strong></p>

      {/* Discount code input */}
      <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          placeholder="Discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.trim().toUpperCase())}
          style={{ padding: '5px', width: '60%', borderRadius: '4px', border: '1px solid hotpink', outlineColor: 'hotpink', color: 'hotpink', margin: '0 auto', display: 'block' }}
        />
      </div>

      <p style={{ color: '#fff', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        Total after discount: <strong style={{color: 'hotpink'}}> ${discountedTotal.toFixed(2)}</strong>
      </p>

      {/* Checkout buttons */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#6c46dd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>

        <button
          onClick={clearCart}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: 'hotpink', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cancel All
        </button>
      </div>

      {message && (
        <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>
      )}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <hr style={{ margin: '3rem 0', borderColor: 'hotpink'}} />

      {/* Add More Items Section */}
      <h3 style={{ color: 'hotpink', textAlign: 'center', marginTop: '2.5rem', marginBottom: '1.5rem' }}>Add More Items 📚</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {books.map((book) => (
          <li  key={book._id} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, color: '#fff' }}>
            {book.title} - ${book.price}{' '}
            </p>
            <button style={{backgroundColor: '#6c46dd', border: 'none', padding: '0.5rem', borderRadius: '5px', color: 'white', cursor: 'pointer'
            }} onClick={() => addItem(book._id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
