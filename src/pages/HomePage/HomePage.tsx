import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel";
import { LazySection } from "../../components/LazySection";
import { SkeletonCarousel, SkeletonCard } from "../../components/Skeleton";
import Button from "../../components/Button";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { setProducts, getFeaturedProducts, getDigitalProducts } =
    useProductStore();
  const [loadSpline, setLoadSpline] = useState(false);

  // Load products in background (non-blocking)
  useEffect(() => {
    if (products.length > 0) {
      setProducts(products);
    }
  }, [products, setProducts]);

  // Lazy load Spline after Hero renders
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setLoadSpline(true), { timeout: 2000 });
    } else {
      setTimeout(() => setLoadSpline(true), 1000);
    }
  }, []);

  // Memoize expensive computations
  const featuredProducts = useMemo(() => {
    if (products.length === 0) return [];
    return getFeaturedProducts();
  }, [products, getFeaturedProducts]);
  
  const digitalProducts = useMemo(() => {
    if (products.length === 0) return [];
    return getDigitalProducts().filter((p) => p.is_free);
  }, [products, getDigitalProducts]);

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section - Renders IMMEDIATELY */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              Chào Mừng Bạn Đến Với USide Shop
            </h1>
            <p className="hero-description">
              Khám phá bộ sưu tập gaming hardware chất lượng cao và digital
              products.
            </p>
          </div>
          <div className="hero-visual">
            <div className="cloud-image">
              {loadSpline ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<spline-viewer loading-anim-type="none" url="https://prod.spline.design/ZXsHBKR839LKz3yn/scene.splinecode"></spline-viewer>',
                  }}
                />
              ) : (
                <div className="spline-placeholder" />
              )}
            </div>
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

      {/* Featured Products Section - Lazy Load */}
      <LazySection
        threshold={0.1}
        rootMargin="100px"
        fallback={
          <section className="featured-section">
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-star"></i>
                  Sản Phẩm Nổi Bật
                </h2>
                <p className="section-description">
                  Những sản phẩm gaming gear được yêu thích nhất
                </p>
              </div>
              <SkeletonCarousel items={4} />
            </div>
          </section>
        }
      >
        <section className="featured-section">
          {featuredProducts.length > 0 ? (
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
          ) : (
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
              <SkeletonCarousel items={4} />
            </section>
          )}
        </section>
      </LazySection>

      {/* Free Digital Products Section - Lazy Load */}
      <hr className="line"></hr>
      <LazySection
        threshold={0.1}
        rootMargin="100px"
        fallback={
          <section className="digital-section">
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-download"></i>
                  Tải Miễn Phí
                </h2>
                <p className="section-description">
                  Wallpaper, preset và template chất lượng cao - miễn phí
                </p>
              </div>
              <SkeletonCarousel items={4} />
            </div>
          </section>
        }
      >
        <section className="digital-section">
          {digitalProducts.length > 0 ? (
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
          ) : (
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
              <SkeletonCarousel items={4} />
            </section>
          )}
        </section>
      </LazySection>

      {/* Categories Section - Lazy Load */}
      <LazySection
        threshold={0.2}
        rootMargin="50px"
        fallback={
          <section className="categories-section">
            <div className="categories-wrapper">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-th-large"></i>
                  Danh Mục Sản Phẩm
                </h2>
              </div>
              <SkeletonCard count={2} />
            </div>
          </section>
        }
      >
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
      </LazySection>

      {/* Contact Section - Lazy Load */}
      <LazySection
        threshold={0.3}
        rootMargin="0px"
        fallback={
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
            <SkeletonCard count={2} />
          </section>
        }
      >
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
      </LazySection>
    </div>
  );
};

export default HomePage;
