import { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeItem, total } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon === 'SAVE10') setDiscount(0.1);
    else if (coupon === 'SAVE20') setDiscount(0.2);
    else setDiscount(0);
  };

  const discountedTotal = total - total * discount;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                {item.title} - ${item.price} × {item.quantity}
                <button onClick={() => removeItem(item._id)}>❌ Remove</button>
              </li>
            ))}
          </ul>

          <p>Subtotal: ${total.toFixed(2)}</p>
          <input
            type="text"
            placeholder="Enter coupon (SAVE10 or SAVE20)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button onClick={applyCoupon}>Apply Coupon</button>

          {discount > 0 && (
            <p>
              ✅ Discount applied: {(discount * 100).toFixed(0)}% — New total: $
              {discountedTotal.toFixed(2)}
            </p>
          )}

          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
}
