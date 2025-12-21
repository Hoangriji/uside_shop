import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useVirtualScroll } from '../../../hooks/useVirtualScroll';
import { ProductsService } from '../../../services/firebaseService';
import type { Product } from '../../../types';

const ITEM_HEIGHT = 110;
const CONTAINER_HEIGHT = 600;

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

  const featuredVirtual = useVirtualScroll(featuredProducts, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  const digitalVirtual = useVirtualScroll(freeDigitalProducts, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

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
              <div className="virtual-list-container" ref={featuredVirtual.containerRef}>
                <div className="virtual-list-spacer" style={{ height: featuredVirtual.totalHeight }}>
                  {featuredVirtual.virtualItems.map(({ index, offsetTop }) => {
                    const product = featuredProducts[index];
                    return (
                      <div
                        key={product.id}
                        className="product-list-item"
                        style={{ 
                          position: 'absolute',
                          top: offsetTop,
                          left: 0,
                          right: 0,
                          height: ITEM_HEIGHT
                        }}
                      >
                        <div className="product-image-small">
                          <img src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="product-info-main">
                          <div className="product-name-section">
                            <h4>{product.name}</h4>
                            <span className="product-id">#{product.id}</span>
                          </div>
                          <div className="product-meta">
                            <span className="product-category">{product.category}</span>
                            <span className="product-price">
                              {product.price_vnd.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <span className="featured-badge active" onClick={() => handleToggleFeatured(product)}>
                            <i className="fas fa-star"></i> Featured
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              <div className="virtual-list-container" ref={digitalVirtual.containerRef}>
                <div className="virtual-list-spacer" style={{ height: digitalVirtual.totalHeight }}>
                  {digitalVirtual.virtualItems.map(({ index, offsetTop }) => {
                    const product = freeDigitalProducts[index];
                    return (
                      <div
                        key={product.id}
                        className="product-list-item"
                        style={{ 
                          position: 'absolute',
                          top: offsetTop,
                          left: 0,
                          right: 0,
                          height: ITEM_HEIGHT
                        }}
                      >
                        <div className="product-image-small">
                          <img src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="product-info-main">
                          <div className="product-name-section">
                            <h4>{product.name}</h4>
                            <span className="product-id">#{product.id}</span>
                          </div>
                          <div className="product-meta">
                            <span className="product-category">{product.category}</span>
                            <span className="product-size">
                              <i className="fas fa-file"></i> {product.file_size || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <span className="free-badge active" onClick={() => handleToggleFree(product)}>
                            <i className="fas fa-gift"></i> Miễn phí
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManagement;