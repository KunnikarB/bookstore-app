import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Home from './pages/Home.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './pages/Checkout.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
