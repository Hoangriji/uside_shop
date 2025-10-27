import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import { getWishlistProducts } from '../../utils/wishlist';
import { SimpleProductCard } from '../../components/SimpleProductCard/SimpleProductCard';
import type { Product } from '../../types';
import './WishlistPage.css';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    // Load wishlist items
    const loadWishlist = () => {
      const items = getWishlistProducts(products);
      setWishlistItems(items);
    };

    loadWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [products]);

  const handleViewDetails = (productId: number | string) => {
    navigate(`/product/${productId}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page-container">
          <div className="page-header">
            <h1>Danh Sách Yêu Thích</h1>
            <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
          </div>
          <div className="empty-wishlist">
            <i className="fas fa-heart-broken"></i>
            <p>Hãy thêm sản phẩm yêu thích để xem chúng ở đây!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page-container">
        <div className="page-header">
          <h1>Danh Sách Yêu Thích</h1>
          <p>Bạn có {wishlistItems.length} sản phẩm trong danh sách yêu thích</p>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <SimpleProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;