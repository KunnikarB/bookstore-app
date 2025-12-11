import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Home from './pages/Home.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import AddBookPage from './pages/AddBookPage.tsx';
import Footer from './components/Footer.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '80vh',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-book" element={<AddBookPage />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element=
            {<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Footer />
        </div>
        
        </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
