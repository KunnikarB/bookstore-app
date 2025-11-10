import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';

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

  // Fetch all books
  const fetchBooks = async (query?: string) => {
    try {
      const res = await axios.get('http://localhost:3000/api/books', {
        params: query ? { search: query } : {},
      });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: 'hotpink' }}>Books</h2>

      <SearchBar
        onSelect={(book) => {
          addItem(book._id);
        }}
      />

      <div style={{ display: 'grid', gap: '1rem' }}>
        {books.map((book) => (
          <div
            key={book._id}
            style={{ border: '1px solid #4CAF50', padding: '1rem', width: '100%' }}
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
