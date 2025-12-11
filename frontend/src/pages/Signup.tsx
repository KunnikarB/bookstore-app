import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      console.log('User signed up successfully:', userCredential.user);
      toast.success('Account created successfully!');
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account';
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
        backgroundColor: 'var(--bg)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface)',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: `0 0 20px ${'var(--accent)'}`,
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <h2
          style={{
            color: 'var(--accent)',
            marginBottom: '1rem',
            fontSize: '2rem',
          }}
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
            autoComplete="name"
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid var(--border)`,
              width: '100%',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid var(--border)`,
              width: '100%',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid var(--border)`,
              width: '100%',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent-strong)',
              color: 'var(--text-primary)',
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

        <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: 'var(--accent)',
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
