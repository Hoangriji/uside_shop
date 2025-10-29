import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import DashboardApp from './pages/DashboardPage/DashboardApp';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { getWishlistCount } from './utils/wishlist';
import { useProductStore } from './store/productStore';
import './styles/global.css';

const App: React.FC = () => {
  const location = useLocation();
  const [currentAccentColor, setCurrentAccentColor] = useState('#00d2ff');
  const [wishlistCount, setWishlistCount] = useState(0);
  const { loadProducts } = useProductStore();

  // Check if current route is dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Get current page from location (exclude dashboard)
  const currentPage = location.pathname.split('/')[1] || 'home';

  // Load products from Firebase on app start
  useEffect(() => {
    if (!isDashboardRoute) {
      loadProducts();
    }
  }, [loadProducts, isDashboardRoute]);

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

  // If it's a dashboard route, render dashboard app without main layout
  if (isDashboardRoute) {
    return <DashboardApp />;
  }

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
