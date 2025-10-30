import './SkeletonCard.css';

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard = ({ count = 2 }: SkeletonCardProps) => {
  return (
    <div className="skeleton-cards">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-card__icon shimmer" />
          <div className="skeleton-card__title shimmer" />
          <div className="skeleton-card__description shimmer" />
          <div className="skeleton-card__button shimmer" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
