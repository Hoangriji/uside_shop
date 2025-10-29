import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<Product>) => Promise<void>;
  product?: Product | null;
  categories: Category[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product,
  categories 
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price_vnd: 0,
    price_virtual: 0,
    stock_status: 'in_stock',
    featured: false,
    type: 'physical',
    is_free: false,
    images: [],
    tags: [],
    subcategory: '',
    features: [],
    specs: {}
  });
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string>('');
  const [featuresText, setFeaturesText] = useState<string>('');
  const [specsText, setSpecsText] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImageUrls(product.images.join('\n'));
      setFeaturesText(product.features?.join('\n') || '');
      
      // Convert specs object to text format
      const specsStr = product.specs 
        ? Object.entries(product.specs).map(([key, value]) => `${key}: ${value}`).join('\n')
        : '';
      setSpecsText(specsStr);
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price_vnd: 0,
        price_virtual: 0,
        stock_status: 'in_stock',
        featured: false,
        type: 'physical',
        is_free: false,
        images: [],
        tags: [],
        subcategory: '',
        features: [],
        specs: {}
      });
      setImageUrls('');
      setFeaturesText('');
      setSpecsText('');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const images = imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      // Parse features from text
      const features = featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      // Parse specs from text (format: "key: value")
      const specs: Record<string, string> = {};
      specsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key && value) {
              specs[key] = value;
            }
          }
        });

      await onSubmit({
        ...formData,
        images,
        features: features.length > 0 ? features : undefined,
        specs: Object.keys(specs).length > 0 ? specs : undefined
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className={`fas fa-${product ? 'edit' : 'plus'}`}></i>
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm *</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Mô tả *</label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="category">Danh mục *</label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Loại sản phẩm *</label>
              <select
                id="type"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'physical' | 'digital' })}
              >
                <option value="physical">Vật lý</option>
                <option value="digital">Digital</option>
              </select>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="price_vnd">Giá (VNĐ) *</label>
              <input
                id="price_vnd"
                type="number"
                required
                min="0"
                value={formData.price_vnd}
                onChange={(e) => setFormData({ ...formData, price_vnd: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price_virtual">Giá Virtual (UPoints)</label>
              <input
                id="price_virtual"
                type="number"
                min="0"
                value={formData.price_virtual}
                onChange={(e) => setFormData({ ...formData, price_virtual: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="stock_status">Trạng thái kho *</label>
              <select
                id="stock_status"
                required
                value={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as 'in_stock' | 'low_stock' | 'out_of_stock' })}
              >
                <option value="in_stock">Còn hàng</option>
                <option value="low_stock">Sắp hết</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>

            {formData.type === 'digital' && (
              <div className="form-group">
                <label htmlFor="file_size">Kích thước file</label>
                <input
                  id="file_size"
                  type="text"
                  value={formData.file_size || ''}
                  onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                  placeholder="VD: 25 MB"
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="images">URL hình ảnh (mỗi dòng 1 URL) *</label>
              <textarea
                id="images"
                required
                rows={3}
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
              <small>Nhập mỗi URL hình ảnh trên một dòng</small>
            </div>
          </div>

          {/* Features Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-check-circle"></i>
              Tính năng nổi bật
              <span className="optional-badge">Tùy chọn</span>
            </h3>
            <div className="form-group">
              <label htmlFor="features">Danh sách tính năng</label>
              <textarea
                id="features"
                rows={5}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Đèn RGB với 16 triệu màu sắc&#10;Hệ thống massage 4 motor tích hợp&#10;Điều khiển từ xa tiện lợi"
              />
              <small>Nhập mỗi tính năng trên một dòng</small>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <i className="fas fa-cog"></i>
              Thông số kỹ thuật
              <span className="optional-badge">Tùy chọn</span>
            </h3>
            <div className="form-group">
              <label htmlFor="specs">Thông số chi tiết</label>
              <textarea
                id="specs"
                rows={6}
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                placeholder="Chất liệu: Da PU + Kim loại&#10;RGB: 16 triệu màu&#10;Massage: 4 motor&#10;Tải trọng: 150kg&#10;Chiều cao: 120-130cm"
              />
              <small>Nhập mỗi thông số theo định dạng "Tên: Giá trị" trên một dòng</small>
            </div>
          </div>

          <div className="form-row form-checkboxes">
            <div className="form-checkbox">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured">
                <i className="fas fa-star"></i> Sản phẩm nổi bật
              </label>
            </div>

            {formData.type === 'digital' && (
              <div className="form-checkbox">
                <input
                  id="is_free"
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                />
                <label htmlFor="is_free">
                  <i className="fas fa-gift"></i> Miễn phí
                </label>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> {product ? 'Cập nhật' : 'Thêm mới'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
