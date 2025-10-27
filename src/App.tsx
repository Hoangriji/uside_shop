import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { getWishlistCount } from './utils/wishlist';
import './styles/global.css';

const App: React.FC = () => {
  const location = useLocation();
  const [currentAccentColor, setCurrentAccentColor] = useState('#00d2ff');
  const [wishlistCount, setWishlistCount] = useState(0);

  // Get current page from location
  const currentPage = location.pathname.split('/')[1] || 'home';

  // Load wishlist count
  useEffect(() => {
    setWishlistCount(getWishlistCount());

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistCount());
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  // Update CSS variables when accent color changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', currentAccentColor);
  }, [currentAccentColor]);

  return (
    <div className="App">
      <Header 
        currentPage={currentPage} 
        wishlistCount={wishlistCount}
        currentAccentColor={currentAccentColor}
        setCurrentAccentColor={setCurrentAccentColor}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
};

export default App;
