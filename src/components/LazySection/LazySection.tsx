import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './LazySection.css';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  fadeIn?: boolean;
  onVisible?: () => void;
}

export const LazySection = ({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  fadeIn = true,
  onVisible,
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    
    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasBeenVisible(true);
      onVisible?.();
      return;
    }

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setIsVisible(true);
            setHasBeenVisible(true);
            onVisible?.();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    // Cleanup to prevent memory leaks
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasBeenVisible, threshold, rootMargin, onVisible]);

  return (
    <div
      ref={sectionRef}
      className={`lazy-section ${fadeIn && isVisible ? 'lazy-section--visible' : ''} ${className}`}
      data-visible={isVisible}
    >
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
