import BookList from '../components/BookList.tsx';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Update visibility whenever user changes
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [user]);

  return (
    <div>
      {showWelcome && (
        <h2
          className="fade-in"
          style={{
            color: 'hotpink',
            textAlign: 'center',
            marginTop: '2rem',
            fontWeight: 'bold',
          }}
        >
          Welcome, {user?.displayName || user?.email?.split('@')[0]} 👋
        </h2>
      )}
      <BookList />
    </div>
  );
}
