import { useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <input style={{padding: '0.5rem', width: '85%', borderRadius: '4px', border: '1px solid #4CAF50', outlineColor: 'hotpink', color: '#4CAF50' }}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
      />
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
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
