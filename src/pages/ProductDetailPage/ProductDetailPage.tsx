import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { WishlistButton } from '../../components/WishlistButton';
import { RelatedProducts } from '../../components/RelatedProducts';
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Tìm product trực tiếp từ database
  const product = products.find(p => p.id === id);

  const addToCart = () => {
    if (!product) return;
    console.log('Added to cart:', product, 'Quantity:', quantity);
    // TODO: Implement cart functionality
  };

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  const isInStock = product.stock_status === 'in_stock';

  return (
    <div className="product-detail-page">
      <div className="product-detail-page-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          Quay lại danh sách sản phẩm
        </button>

        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="detail-images">
            <div className="detail-main-image">
              <img 
                src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://via.placeholder.com/800'} 
                alt={product.name}
              />
              {product.discount && (
                <div className="detail-discount-badge">
                  -{product.discount}%
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="detail-image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`detail-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category}</div>
            
            <h1 className="detail-name">{product.name}</h1>
            
            {product.rating && (
              <div className="detail-rating">
                <div className="detail-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`fas fa-star ${star <= product.rating! ? 'active' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="detail-rating-text">
                  {product.rating}/5 ({product.review_count} đánh giá)
                </span>
              </div>
            )}

            <div className="detail-price-section">
              <div className="detail-current-price">{product.price_vnd.toLocaleString()}đ</div>
              {product.original_price_vnd && (
                <div className="detail-original-price">{product.original_price_vnd.toLocaleString()}đ</div>
              )}
              {product.discount && product.original_price_vnd && (
                <div className="detail-savings">Tiết kiệm: {(product.original_price_vnd - product.price_vnd).toLocaleString()}đ</div>
              )}
            </div>

            <div className="detail-stock-status">
              {isInStock ? (
                <span className="detail-in-stock">
                  <i className="fas fa-check-circle"></i>
                  Còn hàng
                </span>
              ) : (
                <span className="detail-out-of-stock">
                  <i className="fas fa-times-circle"></i>
                  Hết hàng
                </span>
              )}
            </div>

            <div className="detail-description">
              <p>{product.description}</p>
            </div>

            {/* Product Actions */}
            <div className="detail-actions">
              <div className="detail-quantity-selector">
                <label>Số lượng:</label>
                <div className="detail-quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="detail-action-buttons">
                <button 
                  className="detail-add-to-cart-btn"
                  onClick={addToCart}
                  disabled={!isInStock}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {isInStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
                
                <WishlistButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price_vnd,
                    image: product.images?.[0] || '',
                    category: product.category,
                    description: product.description,
                    inStock: isInStock
                  }} 
                  variant="full" 
                  size="md" 
                />
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="detail-features">
                <h3>Tính năng nổi bật</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="detail-specifications">
                <h3>Thông số kỹ thuật</h3>
                <div className="detail-specs-grid">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="detail-spec-item">
                      <strong>{key}:</strong>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {product && products.length > 0 && (
        <div>
          <RelatedProducts
            products={(() => {
              const MIN_CARDS = 6;
              const MAX_CARDS = 8;
              
              // 1. Lấy products cùng category/subcategory (ưu tiên cao nhất)
              const sameCategoryProducts = products.filter(p => 
                p.id !== product.id && 
                (p.category === product.category || p.subcategory === product.subcategory)
              );
              
              // Nếu đã đủ 6+ products cùng category → Chỉ hiển thị tối đa 8 products đó
              if (sameCategoryProducts.length >= MIN_CARDS) {
                return sameCategoryProducts.slice(0, MAX_CARDS);
              }
              
              // 2. Nếu chưa đủ 6, thêm products có specific tags (không phải generic tags)
              const genericTags = ['gaming', 'wireless', 'premium', 'pro', 'rgb'];
              const productSpecificTags = product.tags.filter(tag => !genericTags.includes(tag));
              
              const relatedByTags = products.filter(p => {
                if (p.id === product.id) return false;
                if (sameCategoryProducts.some(sp => sp.id === p.id)) return false; // Đã có trong sameCategoryProducts
                
                return p.tags?.some(tag => 
                  productSpecificTags.includes(tag) && !genericTags.includes(tag)
                );
              });
              
              const combined = [...sameCategoryProducts, ...relatedByTags];
              
              // Nếu vẫn chưa đủ 6, lấy thêm products bất kỳ (có chung generic tags)
              if (combined.length < MIN_CARDS) {
                const remaining = products.filter(p => 
                  p.id !== product.id && 
                  !combined.some(cp => cp.id === p.id)
                );
                
                return [...combined, ...remaining].slice(0, Math.max(MIN_CARDS, MAX_CARDS));
              }
              
              // Giới hạn tối đa 8 cards
              return combined.slice(0, MAX_CARDS);
            })()}
            currentProductId={String(product.id)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;