import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { ClickSpark } from './components/ClickSpark';
import { getWishlistCount } from './utils/wishlist';
import { useProductStore } from './store/productStore';
import './styles/global.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage/WishlistPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'));
const DashboardApp = lazy(() => import('./pages/DashboardPage/DashboardApp'));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--theme-background)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid var(--theme-border)',
      borderTop: '3px solid var(--accent-primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

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
    return (
      <Suspense fallback={<PageLoader />}>
        <DashboardApp />
      </Suspense>
    );
  }

  return (
    <ClickSpark>
      <div className="App">
        <Header 
          currentPage={currentPage} 
          wishlistCount={wishlistCount}
          currentAccentColor={currentAccentColor}
          setCurrentAccentColor={setCurrentAccentColor}
        />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </Suspense>
      </div>
    </ClickSpark>
  );
};

export default App;
