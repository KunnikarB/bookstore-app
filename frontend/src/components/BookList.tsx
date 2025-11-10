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
    <div>
      <h2>Books</h2>
      <SearchBar onSearch={fetchBooks} />
      <div style={{ display: 'grid', gap: '1rem' }}>
        {books.map((book) => (
          <div
            key={book._id}
            style={{ border: '1px solid #ccc', padding: '1rem' }}
          >
            <h3>{book.title}</h3>
            <p>By {book.author}</p>
            <p>${book.price}</p>
            {book.stock < 5 && (
              <p style={{ color: 'red' }}>⚠️ Low stock ({book.stock})</p>
            )}
            <button onClick={() => addItem(book)} disabled={book.stock === 0}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
