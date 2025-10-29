import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { ProductsService } from '../../../services/firebaseService';
import type { Product } from '../../../types';

const FeaturedManagement: React.FC = () => {
  const { products, loading, mutate } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [freeDigitalProducts, setFreeDigitalProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      const featured = products.filter(p => p.featured);
      const freeDigital = products.filter(p => p.type === 'digital' && p.is_free);
      
      setFeaturedProducts(featured);
      setFreeDigitalProducts(freeDigital);
    }
  }, [products]);

  const handleToggleFeatured = async (product: Product) => {
    try {
      await ProductsService.updateProduct(product.id, {
        featured: !product.featured
      });
      mutate(); // Refresh data
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái nổi bật');
    }
  };

  const handleToggleFree = async (product: Product) => {
    try {
      await ProductsService.updateProduct(product.id, {
        is_free: !product.is_free
      });
      mutate(); // Refresh data
    } catch (error) {
      console.error('Error toggling free:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái miễn phí');
    }
  };

  if (loading) {
    return (
      <div className="featured-management">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-management">
      <div className="page-header">
        <h2><i className="fas fa-star"></i> Quản lý sản phẩm nổi bật</h2>
      </div>
      
      <div className="featured-sections">
        <div className="featured-section">
          <div className="section-header">
            <div>
              <h3><i className="fas fa-fire"></i> Sản phẩm nổi bật</h3>
              <p className="section-description">
                Sản phẩm được đánh dấu featured sẽ hiển thị trong carousel chính
              </p>
            </div>
            <span className="count-badge">{featuredProducts.length} sản phẩm</span>
          </div>
          
          <div className="featured-grid">
            {featuredProducts.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-star"></i>
                <p>Chưa có sản phẩm nổi bật nào</p>
                <small>Đánh dấu sản phẩm là featured để hiển thị ở đây</small>
              </div>
            ) : (
              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="featured-product-card">
                    <div className="product-card-image">
                      <img src={product.images[0]} alt={product.name} />
                      <span className="featured-badge" onClick={() => handleToggleFeatured(product)}>
                        <i className="fas fa-star"></i> Featured
                      </span>
                    </div>
                    <div className="product-card-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">
                        {product.price_vnd.toLocaleString('vi-VN')}₫
                      </p>
                      <span className="product-category">{product.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="featured-section">
          <div className="section-header">
            <div>
              <h3><i className="fas fa-gift"></i> Sản phẩm digital miễn phí</h3>
              <p className="section-description">
                Sản phẩm digital miễn phí để người dùng tải về
              </p>
            </div>
            <span className="count-badge">{freeDigitalProducts.length} sản phẩm</span>
          </div>
          
          <div className="digital-grid">
            {freeDigitalProducts.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-download"></i>
                <p>Chưa có sản phẩm digital miễn phí nào</p>
                <small>Tạo sản phẩm digital với is_free = true</small>
              </div>
            ) : (
              <div className="product-grid">
                {freeDigitalProducts.map((product) => (
                  <div key={product.id} className="featured-product-card">
                    <div className="product-card-image">
                      <img src={product.images[0]} alt={product.name} />
                      <span className="free-badge" onClick={() => handleToggleFree(product)}>
                        <i className="fas fa-gift"></i> Miễn phí
                      </span>
                    </div>
                    <div className="product-card-info">
                      <h4>{product.name}</h4>
                      <p className="product-size">
                        <i className="fas fa-file"></i> {product.file_size || 'N/A'}
                      </p>
                      <span className="product-category">{product.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManagement;