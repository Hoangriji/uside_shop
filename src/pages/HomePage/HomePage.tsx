import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
import { DataSyncIndicator } from "../../components/DataSyncIndicator/DataSyncIndicator";
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel";
import { TextType } from "../../components/TextType";
import Button from "../../components/Button";
import { ElectricBorder } from '../../components';
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { setProducts, getFeaturedProducts, getDigitalProducts } =
    useProductStore();

  useEffect(() => {
    if (products.length > 0) {
      setProducts(products);
    }
  }, [products, setProducts]);

  const featuredProducts = getFeaturedProducts();
  const digitalProducts = getDigitalProducts().filter((p) => p.is_free);

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  // Chỉ hiển thị loading khi chưa có products nào
  if (loading && products.length === 0) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <p>Lỗi tải dữ liệu: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Data Sync Indicator */}
      <DataSyncIndicator isValidating={loading} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              <TextType
                text={[
                  "Chào Mừng Bạn Đến Với USide Shop",
                  "Khám Phá Thế Giới Gaming Gear Chuyên Nghiệp",
                ]}
                typingSpeed={100}
                deletingSpeed={80}
                pauseDuration={3000}
              />
            </h1>
            <p className="hero-description">
              Khám phá bộ sưu tập gaming hardware chất lượng cao và digital
              products.
            </p>
          </div>
          <div className="hero-visual">
            <div
              className="cloud-image"
              dangerouslySetInnerHTML={{
                __html:
                  '<spline-viewer loading-anim-type="none" url="https://prod.spline.design/ZXsHBKR839LKz3yn/scene.splinecode"></spline-viewer>',
              }}
            />
            <div className="contact-overlay">
              <h3>Cần hỗ trợ mua sắm?</h3>
              <a href="#contact">
                <i className="fab fa-facebook"></i>
                Liên hệ với Support Bot
              </a>
            </div>
          </div>
        </div>

        {/* Categories Grid - Separate from hero-wrapper */}
        <div className="hero-categories-container">
          <div className="hero-categories">
            <div
              className="category-item"
              onClick={() => handleCategoryClick("keyboard")}
            >
              <div className="category-icon-wrapper">
                <i className="fas fa-keyboard"></i>
              </div>
              <span>Bàn Phím</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("headset")}
            >
              <div className="category-icon-wrapper">
                <i className="fas fa-headphones"></i>
              </div>
              <span>Tai Nghe</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("mouse")}
            >
              <div className="category-icon-wrapper">
                <i className="fas fa-mouse"></i>
              </div>
              <span>Chuột</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("monitor")}
            >
              <div className="category-icon-wrapper">
                <i className="fa-solid fa-desktop"></i>
              </div>
              <span>Màn Hình</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("usb")}
            >
              <div className="category-icon-wrapper">
                <i className="fa-brands fa-usb"></i>
              </div>
              <span>USB</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("digital")}
            >
              <div className="category-icon-wrapper">
                <i className="fas fa-file-download"></i>
              </div>
              <span>Tài Liệu Số</span>
            </div>
            <div
              className="category-item"
              onClick={() => handleCategoryClick("other")}
            >
              <div className="category-icon-wrapper">
                <i className="fas fa-plus"></i>
              </div>
              <span>Sản phẩm Khác</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        {featuredProducts.length > 0 && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-star"></i>
                Sản Phẩm Nổi Bật
              </h2>
              <p className="section-description">
                Những sản phẩm gaming gear được yêu thích nhất
              </p>
            </div>

            <ProductCarousel
              products={featuredProducts}
              slidesPerView={4}
              spaceBetween={24}
              showNavigation={true}
              showPagination={false}
              loop={true}
            />

            <div className="section-footer">
              <Button variant="secondary" onClick={() => navigate("/products")}>
                Xem tất cả sản phẩm <i className="fas fa-arrow-right"></i>
              </Button>
            </div>
          </section>
        )}
      </section>

      {/* Free Digital Products Section */}
      <ElectricBorder
        color="var(--accent-primary)"
        speed={1}
        chaos={1}
        thickness={2}
        className="line-electric"
      >
        <hr className="line"></hr>
      </ElectricBorder>
      <section className="digital-section">
        {digitalProducts.length > 0 && (
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-download"></i>
                Tải Miễn Phí
              </h2>
              <p className="section-description">
                Wallpaper, preset và template chất lượng cao - miễn phí
              </p>
            </div>

            <ProductCarousel
              products={digitalProducts}
              slidesPerView={4}
              spaceBetween={24}
              showNavigation={true}
              showPagination={false}
              loop={true}
            />

            <div className="section-footer">
              <Button
                variant="primary"
                onClick={() => navigate("/products?category=digital")}
              >
                Khám phá thêm <i className="fas fa-arrow-right"></i>
              </Button>
            </div>
          </section>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-wrapper">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-th-large"></i>
              Danh Mục Sản Phẩm
            </h2>
          </div>

          <div className="categories-grid">
            <div
              className="category-card hardware"
              onClick={() => navigate("/products")}
            >
              <div className="category-icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3>Gaming Hardware</h3>
              <p>Chuột, bàn phím, tai nghe gaming chất lượng cao</p>
              <Button variant="primary">Khám phá</Button>
            </div>

            <div
              className="category-card digital"
              onClick={() => navigate("/products?category=digital")}
            >
              <div className="category-icon">
                <i className="fas fa-download"></i>
              </div>
              <h3>Digital Products</h3>
              <p>Wallpaper, preset, template miễn phí</p>
              <Button variant="secondary">Khám phá</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-comments"></i>
            Liên Hệ & Thanh Toán
          </h2>
          <p className="section-description">
            Chọn phương thức liên hệ phù hợp với bạn
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card facebook">
            <div className="contact-icon">
              <i className="fab fa-facebook-messenger"></i>
            </div>
            <h3>Messenger</h3>
            <p>Thanh toán VND, tư vấn sản phẩm</p>
            <Button variant="primary">Chat ngay</Button>
          </div>

          <div className="contact-card discord">
            <div className="contact-icon">
              <i className="fab fa-discord"></i>
            </div>
            <h3>Discord Server</h3>
            <p>Thanh toán USide Coin</p>
            <Button variant="secondary">Join server</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
