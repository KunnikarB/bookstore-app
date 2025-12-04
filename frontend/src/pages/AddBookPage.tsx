import { useState, useEffect } from 'react';
import { addBook, getBooks, updateBook, deleteBook } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../config/admins';
import '../index.css';

interface Book {
  id?: string;
  _id?: string;
  title: string;
  author: string;
  price: number;
  stock: number;
}

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to get book ID (handles both id and _id)
  const getBookId = (book: Book): string => {
    return book.id || book._id || '';
  };

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/login');
    } else if (!isAdmin(user.email)) {
      setMessage('❌ Access denied. You must be an admin to add books.');
    } else {
      // Load books if admin
      fetchBooks();
    }
  }, [user, navigate]);

  const fetchBooks = async () => {
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double check admin status
    if (!user || !isAdmin(user.email)) {
      setMessage('❌ Access denied. Admin privileges required.');
      return;
    }

    try {
      if (editingId) {
        if (!editingId || editingId.length === 0) {
          setMessage('❌ No book selected to update.');
          return;
        }
        // Update existing book
        console.log('Updating book with ID:', editingId);
        const response = await updateBook(editingId, {
          title,
          author,
          price: Number(price),
          stock: Number(stock),
        });
        console.log('Update response:', response);
        setMessage(`✅ Book "${title}" updated successfully!`);
        // Clear form and refresh list
        setTitle('');
        setAuthor('');
        setPrice('');
        setStock('');
        setEditingId(null);
        await fetchBooks();
      } else {
        // Add new book
        console.log('Adding new book');
        const res = await addBook({
          title,
          author,
          price: Number(price),
          stock: Number(stock),
        });
        console.log('Add response:', res);
        setMessage(`✅ Book "${res.data.title}" added successfully!`);
        // Clear form and refresh books
        setTitle('');
        setAuthor('');
        setPrice('');
        setStock('');
        await fetchBooks();
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 403) {
        setMessage('❌ Access denied. Admin privileges required.');
      } else if (err.response?.status === 404) {
        await fetchBooks();
        const exists = books.some((b) => (b.id || b._id) === editingId);
        if (exists) {
          setMessage(`✅ Book updated successfully!`);
        } else {
          setMessage('❌ Book not found. Refreshing list…');
        }
      } else {
        setMessage(
          `❌ Failed to ${
            editingId ? 'update' : 'add'
          } book. Check console for details.`
        );
      }
      console.error(error);
    }
  };

  const handleEdit = (book: Book) => {
    const bookId = getBookId(book);
    setEditingId(bookId);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price.toString());
    setStock(book.stock.toString());
    setMessage('');
    console.log('Editing book with ID:', bookId);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setPrice('');
    setStock('');
    setMessage('');
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteBook(id);
      setMessage(`✅ Book "${title}" deleted successfully!`);
      await fetchBooks();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 403) {
        setMessage('❌ Access denied. Admin privileges required.');
      } else {
        setMessage('❌ Failed to delete book. Check console for details.');
      }
      console.error(error);
    }
  };

  // Show access denied if not admin
  if (user && !isAdmin(user.email)) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '4rem auto',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#2d262e',
          borderRadius: '8px',
          color: '#fff',
          boxShadow: '0 0 10px hotpink',
        }}
      >
        <h2 style={{ color: 'hotpink', marginBottom: '1rem' }}>
          🔒 Access Denied
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          You must be an admin to access this page.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#6c46dd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem',
      }}
    >
      <h2
        style={{ color: 'hotpink', marginBottom: '2rem', textAlign: 'center' }}
      >
        📚 {editingId ? 'Edit Book' : 'Add a New Book'}
      </h2>

      {/* Form Section */}
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
          boxShadow: '0 0 10px hotpink',
          marginBottom: '3rem',
        }}
      >
        <input
          style={{
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            fontSize: '1rem',
          }}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          style={{
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            fontSize: '1rem',
          }}
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          style={{
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            fontSize: '1rem',
          }}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          style={{
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            fontSize: '1rem',
          }}
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              backgroundColor: editingId ? '#658d51' : '#6c46dd',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {editingId ? '✓ Update Book' : '+ Add Book'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.75rem 2rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p
          style={{
            marginBottom: '2rem',
            textAlign: 'center',
            color: message.startsWith('✅') ? '#fff' : 'hotpink',
            fontSize: '1.1rem',
          }}
        >
          {message}
        </p>
      )}

      {/* Books List Section */}
      <div>
        <h3
          style={{
            color: 'hotpink',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          📖 All Books ({books.length})
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
        >
          {books.map((book) => {
            const bookId = getBookId(book);
            return (
              <div
                key={bookId}
                style={{
                  backgroundColor: '#2d262e',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 0 10px rgba(255, 105, 180, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <h4
                  style={{
                    color: 'hotpink',
                    marginBottom: '0.5rem',
                    fontSize: '1.2rem',
                  }}
                >
                  {book.title}
                </h4>
                <p style={{ margin: 0 }}>
                  <strong>Author:</strong> {book.author}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Price:</strong> ${book.price}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Stock:</strong> {book.stock}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1rem',
                  }}
                >
                  <button
                    onClick={() => handleEdit(book)}
                    style={{
                      backgroundColor: '#658d51',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      flex: 1,
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bookId, book.title)}
                    style={{
                      backgroundColor: '#d9534f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      flex: 1,
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {books.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '1.1rem',
              marginTop: '2rem',
            }}
          >
            No books available. Add your first book above!
          </p>
        )}
      </div>
    </div>
  );
}
