import { useEffect, useState } from 'react';
import { getBooks, addToCart } from '../api/api.ts';
import SearchBar from './SearchBar.tsx';

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = (query?: string) => {
    getBooks(query).then((res) => setBooks(res));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddToCart = (id: string) => {
    addToCart(id, 1).then(() => alert('Added to cart'));
  };

  return (
    <div>
      <h2>Books</h2>
      <SearchBar onSearch={fetchBooks} />
      <ul>
        {books.map((b) => (
          <li key={b._id}>
            {b.title} - ${b.price} ({b.stock} in stock)
            <button
              onClick={() => handleAddToCart(b._id)}
              disabled={b.stock === 0}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
