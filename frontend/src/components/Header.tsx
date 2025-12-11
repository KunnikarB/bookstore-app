import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import '../index.css';

type HeaderProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export default function Header({ theme, onToggleTheme }: HeaderProps) {
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
    color:
      location.pathname === path
        ? 'var(--accent)'
        : 'var(--text-primary)', // active color
    borderBottom:
      location.pathname === path ? '2px solid var(--accent)' : 'none', // active border
    paddingBottom: '4px',
    transition: 'color 0.2s, border-bottom 0.2s',
  });

  return (
    <header
      style={{
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '1rem',
        borderBottom: '1px solid var(--accent)',
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                backgroundColor: 'var(--accent)',
                color: 'var(--text-primary)',
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
        <button
          onClick={onToggleTheme}
          style={{
            backgroundColor: 'var(--surface-muted)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            padding: '0.4rem 0.8rem',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Auth Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              👤 {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'var(--accent)',
                color: 'var(--text-primary)',
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
                background: 'var(--accent-strong)',
                color: 'var(--text-primary)',
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
                background: 'var(--accent)',
                color: 'var(--text-primary)',
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
