// src/components/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
