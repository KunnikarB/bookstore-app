 
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../index.css';

export default function Header() {
  const { cart } = useCart();

  // Calculate total quantity
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      style={{
        maxWidth: '700px',
        margin: '30px auto',
        padding: '1rem',
        borderBottom: '1px solid hotpink',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: 'hotpink',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        }}
      >
        🏠 Home
      </Link>

      <Link
        to="/add-book"
        style={{
          textDecoration: 'none',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          backgroundColor: 'hotpink',
          padding: '0.2rem 0.5rem',
          borderRadius: '10px',
          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
        }}
      >
        📖 Add Book
      </Link>

      <div style={{ position: 'relative' }}>
        <Link
          to="/cart"
          style={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
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
    </header>
  );
}
