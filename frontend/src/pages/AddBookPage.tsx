import { useState } from 'react';
import axios from 'axios';

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/books', {
        title,
        author,
        price: Number(price),
        stock: Number(stock),
      });
      setMessage(`✅ Book "${res.data.title}" added successfully!`);
      setTitle('');
      setAuthor('');
      setPrice('');
      setStock('');
    } catch (error) {
      setMessage('❌ Failed to add book. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '1rem',
      }}
    >
      <h2 style={{ color: 'hotpink', marginBottom: '2rem', textAlign: 'center' }}>📚 Add a New Book</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#2d262e',
          padding: '3rem',
          borderRadius: '8px',
          color: '#fff',
        }}
      >
        <input
          style={{ margin: '0', padding: '5px' }}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          style={{ margin: '0', padding: '5px' }}
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          style={{ margin: '0', padding: '5px' }}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          style={{ margin: '0', padding: '5px' }}
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#6c46dd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Add Book
        </button>
      </form>
      {message && (
        <p style={{marginTop: '1rem', textAlign: 'center', color: message.startsWith('✅') ? '#fff' : 'hotpink' }}>
          {message}
        </p>
      )}
    </div>
  );
}
