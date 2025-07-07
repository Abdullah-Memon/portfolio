'use client';

import { useState, useEffect, useRef } from 'react';

export default function Counter({ 
  end, 
  duration = 2000, 
  start = 0, 
  prefix = '', 
  suffix = '',
  className = '',
  decimals = 0 
}) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate counter
          const startTime = Date.now();
          const startValue = start;
          const endValue = end;
          const totalChange = endValue - startValue;

          const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = startValue + (totalChange * easeOutQuart);
            setCount(Number(currentValue.toFixed(decimals)));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration, start, hasAnimated, decimals]);

  return (
    <span 
      ref={counterRef}
      className={`number-highlight animate-count-up ${className}`}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
