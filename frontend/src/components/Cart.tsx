import { useEffect, useState } from 'react';
import { getCart } from '../api/api.ts';

type CartItem = {
  book: { title: string; price: number; stock: number };
  quantity: number;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = () => {
    getCart().then((res) => setCart(res.data));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.book.title} x {item.quantity} = $
            {item.book.price * item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
}
