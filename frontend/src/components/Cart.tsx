import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.book._id}>
            {item.book.title} - ${item.book.price} × {item.quantity}
            <button onClick={() => removeItem(item.book._id)}>❌ Remove</button>
          </li>
        ))}
      </ul>
      <p>Subtotal: ${total.toFixed(2)}</p>

      <button
        onClick={() => {
          navigate('/checkout');
        }}
        style={{ marginTop: '1rem' }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
