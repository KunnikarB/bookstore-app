import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Home from './pages/Home.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import AddBookPage from './pages/AddBookPage.tsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

export default function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBookPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
