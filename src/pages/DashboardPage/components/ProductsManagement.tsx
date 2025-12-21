import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useVirtualScroll } from '../../../hooks/useVirtualScroll';
import { ProductsService } from '../../../services/firebaseService';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../../../types';

const ITEM_HEIGHT = 110;
const CONTAINER_HEIGHT = 600;

const ProductsManagement: React.FC = () => {
  const { products, loading, mutate } = useProducts();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const virtualScroll = useVirtualScroll(filteredProducts, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    try {
      await ProductsService.deleteProduct(product.id);
      mutate(); // Refresh data
      alert('Xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

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

  const handleSubmitProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Update existing product
        await ProductsService.updateProduct(editingProduct.id, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        await ProductsService.createProduct(productData as Omit<Product, 'id'>);
        alert('Thêm sản phẩm mới thành công!');
      }
      mutate(); // Refresh data
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="products-management">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-management">
      <div className="page-header">
        <h2><i className="fas fa-box"></i> Quản lý sản phẩm</h2>
        <button className="btn-primary" onClick={handleAddProduct}>
          <i className="fas fa-plus"></i> Thêm sản phẩm mới
        </button>
      </div>
      
      <div className="products-filters">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>
        
        <div className="category-dropdown" ref={categoryDropdownRef}>
          <button
            className={`category-dropdown-btn ${categoryDropdownOpen ? 'open' : ''}`}
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          >
            <i className="fas fa-filter"></i>
            <span>
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Tất cả danh mục'}
            </span>
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {categoryDropdownOpen && (
            <div className="category-dropdown-list">
              <div
                className={`category-option ${!selectedCategory ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategory('');
                  setCategoryDropdownOpen(false);
                }}
              >
                <i className="fas fa-th"></i>
                <span>Tất cả danh mục</span>
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className={`category-option ${selectedCategory === cat.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCategoryDropdownOpen(false);
                  }}
                >
                  <i className="fas fa-tag"></i>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="products-table-wrapper">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-box-open"></i>
            <p>Chưa có sản phẩm nào{searchQuery || selectedCategory ? ' phù hợp với bộ lọc' : ''}.</p>
            {!searchQuery && !selectedCategory && (
              <button className="btn-primary" onClick={handleAddProduct}>
                <i className="fas fa-plus"></i> Thêm sản phẩm đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="virtual-list-container" ref={virtualScroll.containerRef}>
            <div className="virtual-list-spacer" style={{ height: virtualScroll.totalHeight }}>
              {virtualScroll.virtualItems.map(({ index, offsetTop }) => {
                const product = filteredProducts[index];
                const category = categories.find(c => c.id === product.category);
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
                        <span className="category-badge">
                          {category?.name || product.category}
                        </span>
                        <span className="product-price">
                          {product.price_vnd.toLocaleString('vi-VN')}₫
                        </span>
                        <span className={`status-badge ${product.stock_status}`}>
                          {product.stock_status === 'in_stock' ? 'Còn hàng' : 
                           product.stock_status === 'low_stock' ? 'Sắp hết' : 'Hết hàng'}
                        </span>
                      </div>
                    </div>
                    <div className="product-actions">
                      {product.featured ? (
                        <span className="featured-badge active" onClick={() => handleToggleFeatured(product)}>
                          <i className="fas fa-star"></i>
                        </span>
                      ) : (
                        <span className="not-featured" onClick={() => handleToggleFeatured(product)}>
                          <i className="far fa-star"></i>
                        </span>
                      )}
                      <button className="btn-action btn-edit" title="Chỉnh sửa" onClick={() => handleEditProduct(product)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-action btn-delete" title="Xóa" onClick={() => handleDeleteProduct(product)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="table-footer">
        <p>Hiển thị {filteredProducts.length} / {products.length} sản phẩm</p>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default ProductsManagement;