/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
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
        <h2 style={{ color: 'hotpink', marginBottom: '1rem', fontSize: '2rem' }}>🛍️ Login</h2>

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}
        >
          <input
            type="email"
            placeholder="Email"
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
            placeholder="Password"
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
            Login 👤
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: '#658d51',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '50%',
            margin: '0 auto',
            fontWeight: 'bold',
          }}
        >
          Sign in with Google
        </button>

        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: 'hotpink',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '50%',
            margin: '0 auto',
            fontWeight: 'bold',
          }}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
