import './SkeletonCarousel.css';

interface SkeletonCarouselProps {
  items?: number;
}

export const SkeletonCarousel = ({ items = 4 }: SkeletonCarouselProps) => {
  return (
    <div className="skeleton-carousel">
      <div className="skeleton-carousel__track">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="skeleton-carousel__item">
            <div className="skeleton-carousel__image shimmer" />
            <div className="skeleton-carousel__content">
              <div className="skeleton-carousel__badge shimmer" />
              <div className="skeleton-carousel__title shimmer" />
              <div className="skeleton-carousel__price shimmer" />
              <div className="skeleton-carousel__button shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCarousel;
