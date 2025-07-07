'use client';

import React, { Suspense, lazy } from 'react';
import { useIntersectionObserver } from '@/hooks';

// Lazy load sections for better performance
const Hero = lazy(() => import("./hero"));
const Feature = lazy(() => import("./feature"));
const MobileConvenience = lazy(() => import("./mobile-convenience"));
const Testimonials = lazy(() => import("./testimonials"));
const Faqs = lazy(() => import("./faqs"));

// Loading fallbacks for better UX
const SectionFallback = () => (
  <div className="h-96 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8" />
);

const HeroFallback = () => (
  <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" />
);

// Intersection observer wrapper for lazy loading sections
function LazySection({ children, fallback = <SectionFallback /> }) {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero section loads immediately for above-the-fold content */}
      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>
      
      <LazySection>
        <Feature />
      </LazySection>
      
      <LazySection>
        <MobileConvenience />
      </LazySection>
      
      <LazySection>
        <Testimonials />
      </LazySection>
      
      <LazySection>
        <Faqs />
      </LazySection>
    </>
  );
}
