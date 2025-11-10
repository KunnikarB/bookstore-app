import { useEffect, useState } from 'react';
import { getBooks } from '../api/api.ts';
import SearchBar from './SearchBar.tsx';
import { useCart } from '../context/CartContext.tsx';

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const { addItem } = useCart();

  const fetchBooks = (query?: string) => {
    getBooks(query).then((res) => setBooks(res));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: 'hotpink' }}>Books</h2>
      <SearchBar onSearch={fetchBooks} />
      <div style={{ display: 'grid', gap: '1rem' }}>
        {books.map((book) => (
          <div
            key={book._id}
            style={{ border: '1px solid #4CAF50', padding: '1rem' }}
          >
            <h3 style={{ color: 'hotpink' }}>{book.title}</h3>
            <p style={{ color: '#4CAF50' }}>By {book.author}</p>
            <p style={{ color: 'hotpink' }}>${book.price}</p>
            {book.stock < 5 && (
              <p style={{ color: 'red' }}>⚠️ Low stock ({book.stock})</p>
            )}
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
              onClick={() => addItem(book._id)}
              disabled={book.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
