import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

interface TextTypeProps {
  className?: string;
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  showCursor?: boolean;
  cursorCharacter?: string;
}

export const TextType = ({
  text,
  typingSpeed = 100,
  pauseDuration = 2000,
  deletingSpeed = 50,
  loop = true,
  className = '',
  textColors = [],
  showCursor = true,
  cursorCharacter = '|'
}: TextTypeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const textArray = useMemo(() => text, [text]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return undefined;
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor]);

  useEffect(() => {
    const currentText = textArray[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentCharIndex < currentText.length) {
          setDisplayedText(currentText.slice(0, currentCharIndex + 1));
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (currentCharIndex > 0) {
          setDisplayedText(currentText.slice(0, currentCharIndex - 1));
          setCurrentCharIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          if (loop || currentTextIndex < textArray.length - 1) {
            setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentTextIndex, textArray, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <div className={`text-type ${className}`}>
      <span style={{ color: getCurrentTextColor() }}>
        {displayedText}
      </span>
      {showCursor && (
        <span ref={cursorRef} className="text-type__cursor">
          {cursorCharacter}
        </span>
      )}
    </div>
  );
};
