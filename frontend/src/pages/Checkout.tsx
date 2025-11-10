import { useCart } from '../context/CartContext.tsx';
import { useState } from 'react';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [completed, setCompleted] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setCompleted(true);
  };

  if (completed)
    return <h2>🎉 Thank you for your purchase! Your order is complete.</h2>;

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            {item.title} × {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={handleCheckout}>Confirm Payment</button>
    </div>
  );
}
