

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkoutCart = async (cart: any) => {
  const res = await fetch('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart }), // send the cart to backend
  });

  const data = await res.json(); // parse JSON directly

  if (!res.ok) throw new Error(data.error || 'Checkout failed');

  return data;
};
