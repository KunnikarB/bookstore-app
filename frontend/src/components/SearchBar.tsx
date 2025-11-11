import { useState, useEffect } from 'react';
import axios from 'axios';

type Book = {
  _id: string;
  title: string;
};

type Props = {
  onSelect: (book: Book) => void; // called when user clicks a suggestion
};

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions from backend
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/books', {
          params: { search: query },
        });
        setSuggestions(res.data.slice(0, 5)); // limit to 5 suggestions
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ margin: '1rem 0', position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
        style={{
          padding: '1rem',
          width: '100%',
          borderRadius: '4px',
          border: '1px solid hotpink',
          outlineColor: 'hotpink',
          color: 'hotpink',
        }}
      />
      {loading && (
        <p style={{ color: '#999', marginTop: '0.5rem' }}>Loading...</p>
      )}

      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            color: '#fff',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            zIndex: 10,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((book) => (
            <li
              key={book._id}
              style={{
                padding: '0.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid #555'
              }}
              onClick={() => {
                onSelect(book);
                setQuery(''); // clear search input after selection
                setSuggestions([]);
              }}
            >
              {book.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
