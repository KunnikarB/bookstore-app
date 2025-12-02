import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const { addItem } = useCart();

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
    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
      <h2
        style={{
          color: 'hotpink',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}
      >
        📚 Books
      </h2>

      <SearchBar
        onSelect={(book) => {
          addItem(book._id);
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '3rem',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: '1px solid #2d262e',
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: '#2d262e',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(255, 105, 180, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => (
              (e.currentTarget.style.transform = 'scale(1.03)'),
              (e.currentTarget.style.boxShadow = '0 0 15px hotpink')
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.transform = 'scale(1)'),
              (e.currentTarget.style.boxShadow =
                '0 0 10px rgba(255, 105, 180, 0.3)')
            )}
          >
            <div>
              <h3
                style={{
                  color: 'hotpink',
                  marginBottom: '0.5rem',
                  fontSize: '1.5rem',
                }}
              >
                {book.title}
              </h3>
              <p style={{ color: '#fff', marginBottom: '0.3rem' }}>
                By {book.author}
              </p>
              <p style={{ color: 'hotpink', fontWeight: 'bold' }}>
                ${book.price.toFixed(2)}
              </p>
              {book.stock < 5 && (
                <p style={{ color: 'red', fontSize: '0.9rem' }}>
                  ⚠️ Low stock ({book.stock})
                </p>
              )}
            </div>

            <button
              style={{
                marginTop: '1rem',
                padding: '0.7rem',
                width: '50%',
                alignSelf: 'center',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#6c46dd',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
              }}
              onClick={() => addItem(book.id)}
              disabled={book.stock === 0}
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
