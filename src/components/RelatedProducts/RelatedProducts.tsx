import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { SimpleProductCard } from '../SimpleProductCard/SimpleProductCard';
import type { Product } from '../../types';
import { useRef } from 'react';
import type { SwiperRef } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import './RelatedProducts.css';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string | number;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, currentProductId }) => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperRef>(null);

  // Filter ra sản phẩm hiện tại - CHỈ KHÁC Ở ĐÂY
  const relatedProducts = products.filter(p => p.id !== currentProductId);

  if (relatedProducts.length === 0) return null;

  // Default props giống ProductCarousel
  const slidesPerView = 4;
  const spaceBetween = 24;
  const showNavigation = true;
  const showPagination = false;
  const loop = true;

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="related-products-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-box-open"></i>
          Sản Phẩm Liên Quan
        </h2>
        <p>Những sản phẩm tương tự bạn có thể quan tâm</p>
      </div>

      <div className="related-products-carousel">
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
          loop={loop && relatedProducts.length > slidesPerView}
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
          className="related-swiper"
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <SimpleProductCard
                product={product}
                onViewDetails={(id: string | number) => navigate(`/product/${id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
