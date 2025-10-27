import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  currentPage: string;
  wishlistCount: number;
  currentAccentColor: string;
  setCurrentAccentColor: (color: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  wishlistCount = 0,
  currentAccentColor,
  setCurrentAccentColor 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  // Apply current accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', currentAccentColor);
  }, [currentAccentColor]);

  // Set a CSS variable with the header height so pages can offset content accordingly
  useEffect(() => {
    const setHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    // initial set
    setHeaderHeight();

    // update on resize
    window.addEventListener('resize', setHeaderHeight);
    return () => window.removeEventListener('resize', setHeaderHeight);
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Trang Chủ', icon: 'fas fa-home', path: '/' },
    { id: 'products', label: 'Sản Phẩm', icon: 'fas fa-th-large', path: '/products' },
    { id: 'about', label: 'Giới Thiệu', icon: 'fas fa-info-circle', path: '/about' },
    { id: 'contact', label: 'Liên Hệ', icon: 'fas fa-envelope', path: '/contact' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
    // Implement search functionality
  };

  // close color picker when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!colorPickerRef.current) return;
      const target = e.target as Node | null;
      if (colorPickerRef.current.contains(target)) return;
      setColorPickerOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setColorPickerOpen(false);
    };

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <i className="fas fa-cloud"></i>
          </div>
          <div>
            <h1 className="logo-text">Uside Shop</h1>
            <p className="logo-subtitle">Gaming & Digital Store</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="main-nav">
          <ul className="nav-menu">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Expandable Search */}
          <form className={`search-container ${searchOpen ? 'open' : ''}`} onSubmit={handleSearch}>
            <button
              type="button"
              className="search-button"
              onClick={() => {
                // focus the input and open the search area
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <i className="fas fa-search"></i>
            </button>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                // keep it open if there is text, otherwise close after small delay
                setTimeout(() => {
                  if (searchQuery.trim() === '') setSearchOpen(false);
                }, 100);
              }}
            />
          </form>

          {/* Wishlist */}
          <button 
            className="action-button" 
            title="Yêu thích"
            onClick={() => navigate('/wishlist')}
          >
            <i className="fas fa-heart"></i>
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </button>

          {/* Accent Color Picker */}
          <div className={`accent-color-picker ${colorPickerOpen ? 'open' : ''}`} ref={colorPickerRef}>
            <button
              className="action-button"
              title="Thay đổi màu chủ đề"
              aria-expanded={colorPickerOpen}
              onClick={() => setColorPickerOpen((s) => !s)}
            >
              <i className="fas fa-palette"></i>
            </button>
            <div className="color-picker-dropdown" role="menu">
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#00d2ff' }}
                onClick={() => setCurrentAccentColor('#00d2ff')}
              ></div>
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#ff6b6b' }}
                onClick={() => setCurrentAccentColor('#ff6b6b')}
              ></div>
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#4ecdc4' }}
                onClick={() => setCurrentAccentColor('#4ecdc4')}
              ></div>
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#45b7d1' }}
                onClick={() => setCurrentAccentColor('#45b7d1')}
              ></div>
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#96ceb4' }}
                onClick={() => setCurrentAccentColor('#96ceb4')}
              ></div>
              <div 
                className="accent-btn" 
                style={{ backgroundColor: '#feca57' }}
                onClick={() => setCurrentAccentColor('#feca57')}
              ></div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;