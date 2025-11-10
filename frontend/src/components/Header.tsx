/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '1rem',
        borderBottom: '1px solid #4CAF50',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: 'hotpink', fontWeight: 'bold', fontSize: '1.5rem' }}>
        🏠 Home
      </Link>
      <Link to="/cart" style={{ textDecoration: 'none', color: '#4CAF50', fontWeight: 'bold', fontSize: '1.5rem' }}>🛒 Cart</Link>
    </header>
  );
}
