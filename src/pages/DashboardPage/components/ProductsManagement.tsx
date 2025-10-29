import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { ProductsService } from '../../../services/firebaseService';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../../../types';

const ProductsManagement: React.FC = () => {
  const { products, loading, mutate } = useProducts();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
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
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá (VNĐ)</th>
                  <th>Trạng thái</th>
                  <th>Nổi bật</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.id === product.category);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-image">
                          <img src={product.images[0]} alt={product.name} />
                        </div>
                      </td>
                      <td>
                        <div className="product-name">
                          <strong>{product.name}</strong>
                          <span className="product-id">#{product.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {category?.name || product.category}
                        </span>
                      </td>
                      <td>
                        <strong>{product.price_vnd.toLocaleString('vi-VN')}₫</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${product.stock_status}`}>
                          {product.stock_status === 'in_stock' ? 'Còn hàng' : 
                           product.stock_status === 'low_stock' ? 'Sắp hết' : 'Hết hàng'}
                        </span>
                      </td>
                      <td>
                        {product.featured ? (
                          <span className="featured-badge active" onClick={() => handleToggleFeatured(product)}>
                            <i className="fas fa-star"></i> Nổi bật
                          </span>
                        ) : (
                          <span className="not-featured" onClick={() => handleToggleFeatured(product)}>
                            <i className="far fa-star"></i> Đánh dấu
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action btn-edit" title="Chỉnh sửa" onClick={() => handleEditProduct(product)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-action btn-delete" title="Xóa" onClick={() => handleDeleteProduct(product)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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