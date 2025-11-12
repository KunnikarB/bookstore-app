import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1️⃣ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // 2️⃣ Save user to MongoDB via backend
      await axios.post('http://localhost:3000/api/users', {
        name,
        email,
        uid: userCredential.user.uid, // optional: link Firebase UID
      });

      console.log('User signed up and saved in MongoDB:', userCredential.user);
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1c1b1f',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#2d262e',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 0 20px hotpink',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <h2
          style={{ color: 'hotpink', marginBottom: '1rem', fontSize: '2rem' }}
        >
          Create Account
        </h2>

        <form
          onSubmit={handleSignup}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#6c46dd',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '50%',
              margin: '0 auto',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Sign Up
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p style={{ marginTop: '1rem', color: '#fff' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: 'hotpink',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
