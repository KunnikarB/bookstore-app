import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import '../index.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // <--- get current path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const { cart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Calculate total quantity
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const linkStyle = (path: string) => ({
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: '"Playfair Display", serif',
    color: location.pathname === path ? 'hotpink' : '#fff', // active color
    borderBottom: location.pathname === path ? '2px solid hotpink' : 'none', // active border
    paddingBottom: '4px',
    transition: 'color 0.2s, border-bottom 0.2s',
  });

  return (
    <header
      style={{
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '1rem',
        borderBottom: '1px solid hotpink',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}
    >
      <Link to="/" style={linkStyle('/')}>
        🏠 Home
      </Link>

      <Link to="/add-book" style={linkStyle('/add-book')}>
        📖 Add Book
      </Link>

      <div style={{ position: 'relative' }}>
        <Link to="/cart" style={linkStyle('/cart')}>
          🛒 Cart
        </Link>
        {itemCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-12px',
              right: '-24px',
              backgroundColor: 'hotpink',
              color: 'white',
              borderRadius: '50%',
              padding: '4px 8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 0 6px rgba(0,0,0,0.3)',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
          >
            {itemCount}
          </span>
        )}
      </div>

      {/* Auth Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>
              👤 {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'hotpink',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#6c46dd',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'hotpink',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
