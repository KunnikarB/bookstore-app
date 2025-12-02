import { auth } from '../firebase';

const apiBase =
  (import.meta as any)?.env?.VITE_API_URL ||
  ((import.meta as any)?.env?.VITE_API_BASE
    ? `${(import.meta as any).env.VITE_API_BASE}/api`
    : undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkoutCart = async (cart: any, discountCode?: string) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(
    `${apiBase || 'http://localhost:3000/api'}/checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ cart, discountCode }), // send the cart and discount code to backend
    }
  );

  const data = await res.json(); // parse JSON directly

  if (!res.ok) throw new Error(data.error || 'Checkout failed');

  return data;
};
