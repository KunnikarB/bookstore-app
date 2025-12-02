import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0)
    return (
      <p
        style={{
          color: 'hotpink',
          fontWeight: 'bold',
          maxWidth: '700px',
          margin: '20px auto',
          fontSize: '1.2rem',
        }}
      >
        Your cart is empty
      </p>
    );

  return (
    <div
      style={{
        maxWidth: '800px',
        width: '100%',
        margin: '5rem auto',
        backgroundColor: '#2d262e',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px hotpink',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#fff', fontWeight: 'bold' }}>Your Cart</h2>
      <ul>
        {cart.map((item, idx) => (
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem',
              padding: '0.4rem',
              borderBottom: '1px solid #6c46dd',
              color: 'hotpink',
              fontSize: '1.1rem',
            }}
            key={`${item.book?.id || 'unknown'}-${idx}`}
          >
            {item.book?.title ?? 'Unknown'} - ${item.book?.price ?? 0} ×{' '}
            {item.quantity}
            <button
              style={{
                cursor: 'pointer',
                backgroundColor: '#6c46dd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.6rem',
                fontSize: '1rem',
              }}
              onClick={() => item.book?.id && removeItem(item.book.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p
        style={{
          fontWeight: 'bold',
          color: '#fff',
          marginTop: '2rem',
          fontSize: '1.5rem',
        }}
      >
        Subtotal: ${total.toFixed(2)}
      </p>

      <button
        onClick={() => {
          navigate('/checkout');
        }}
        style={{
          margin: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1.2rem',
          cursor: 'pointer',
          backgroundColor: '#6c46dd',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        🛍️ Proceed to Checkout
      </button>
    </div>
  );
}
