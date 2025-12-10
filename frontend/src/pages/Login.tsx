/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      toast.success('Logged in successfully! 🎉');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSignupNavigate = () => {
    navigate('/signup');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in with Google! 🎉');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Google login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in with GitHub! 🎉');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'GitHub login failed';
      setError(errorMessage);
      toast.error(errorMessage);
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
          👩🏻‍💻 Login
        </h2>

        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
          }}
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
              fontSize: '1rem',
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
              fontSize: '1rem',
            }}
            required
          />

          {/* Row 1: Login and Sign up buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: '#6c46dd',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Login 👤
            </button>
            <button
              type="button"
              onClick={handleSignupNavigate}
              style={{
                backgroundColor: '#dd46a8',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Sign up ✨
            </button>
          </div>
        </form>

        {error && <p style={{ color: 'red', margin: '0' }}>{error}</p>}

        {/* Row 2: Google and GitHub sign-in buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button
            onClick={handleGoogleLogin}
            style={{
              backgroundColor: '#658d51',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: 1,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Google 🌐
          </button>

          <button
            onClick={handleGithubLogin}
            style={{
              backgroundColor: '#333',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              flex: 1,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            GitHub 🐙
          </button>
        </div>
      </div>
    </div>
  );
}
