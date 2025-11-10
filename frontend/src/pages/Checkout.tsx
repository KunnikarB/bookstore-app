import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutCart } from '../api/checkoutapi'; // import your API function

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await checkoutCart(cart); // send cart to backend
      setMessage(`✅ ${data.message}. Total: $${data.total}`);
      clearCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return <p>Your cart is empty</p>;

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.book._id}>
            {item.book.title} - ${item.book.price} × {item.quantity}
          </li>
        ))}
      </ul>

      <p>Subtotal: ${total?.toFixed(2) || 0}</p>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
