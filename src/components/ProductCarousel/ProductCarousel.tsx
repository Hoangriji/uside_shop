import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { SimpleProductCard } from '../SimpleProductCard/SimpleProductCard';
import type { Product } from '../../types';
import { useRef, memo, useCallback } from 'react';
import type { SwiperRef } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import './ProductCarousel.css';

interface ProductCarouselProps {
  products: Product[];
  slidesPerView?: number;
  spaceBetween?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
}

const ProductCarousel: React.FC<ProductCarouselProps> = memo(({
  products,
  slidesPerView = 4,
  spaceBetween = 24,
  showNavigation = true,
  showPagination = false,
  loop = true,
}) => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  }, []);

  return (
    <div className="product-carousel">
      {/* Custom Navigation Buttons */}
      {showNavigation && (
        <>
          <button className="nav-button prev" onClick={handlePrev}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="nav-button next" onClick={handleNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
      
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={spaceBetween}
        slidesPerView={1}
        pagination={showPagination ? { clickable: true } : false}
        loop={loop && products.length > slidesPerView}
        freeMode={false}
        grabCursor={true}
        slidesPerGroup={1} 
        speed={400} 
        breakpoints={{
          // Mobile
          320: {
            slidesPerView: 1.2,
            spaceBetween: 16,
            navigation: false,
            centeredSlides: false,
          },
          // Tablet
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
            navigation: false,
            centeredSlides: false,
          },
          // Small Desktop
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
            centeredSlides: false,
          },
          // Large Desktop
          1280: {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween,
            centeredSlides: false, 
          },
        }}
        className="product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <SimpleProductCard
              product={product}
              onViewDetails={(id: string | number) => navigate(`/product/${id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';

export default ProductCarousel;
