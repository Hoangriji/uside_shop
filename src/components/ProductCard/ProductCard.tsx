import React from 'react';
import Badge from '../Badge';
import { WishlistButton } from '../WishlistButton';
import './ProductCard.css';

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  is_free?: boolean;
  file_size?: string;
}

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: number | string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const handleCardClick = () => {
    onViewDetails(product.id);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="card-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="card-image"
        />
      </div>

      <div className="card-content">
        <p className="card-category">{product.category}</p>
        
        <h3 className="card-title">{product.name}</h3>
        
        <div className="card-price">
          <span className="card-price-current">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="card-price-original">
              {product.originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        <div className="card-footer">
          <div className="card-stock">
            {product.inStock ? (
              <Badge variant="success">
                <i className="fas fa-star"></i> Còn hàng
              </Badge>
            ) : (
              <Badge variant="danger">
                Hết hàng
              </Badge>
            )}
          </div>

          <WishlistButton product={product} variant="icon" size="sm" />
        </div>
      </div>
    </div>
  );
};