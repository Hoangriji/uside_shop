import React, { useState, useEffect } from 'react';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../../utils/wishlist';
import './WishlistButton.css';

interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
}

interface WishlistButtonProps {
  product: Product;
  variant?: 'icon' | 'full'; // icon-only or icon + text
  size?: 'sm' | 'md' | 'lg';
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  variant = 'full',
  size = 'md'
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check wishlist status
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));

    // Listen for wishlist updates from other components
    const handleWishlistUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { productId, cleared } = customEvent.detail || {};
      
      // If wishlist was cleared or this product was updated, recheck status
      if (cleared || productId === String(product.id)) {
        setIsWishlisted(isInWishlist(product.id));
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const className = `wishlist-btn ${variant} ${size} ${isWishlisted ? 'active' : ''}`;

  return (
    <button 
      className={className}
      onClick={toggleWishlist}
      title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    >
      <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
      {variant === 'full' && <span>Yêu thích</span>}
    </button>
  );
};
