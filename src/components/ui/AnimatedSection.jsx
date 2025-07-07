'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedSection({ 
  children, 
  className = '', 
  animation = 'animate-fade-in-up',
  delay = 0,
  threshold = 0.1 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animation : 'opacity-0'} transition-all duration-700`}
    >
      {children}
    </div>
  );
}
