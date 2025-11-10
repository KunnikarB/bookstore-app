import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Home
      </Link>
      <Link to="/cart">Cart</Link>
    </header>
  );
}
