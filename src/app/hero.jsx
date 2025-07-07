"use client";

import { useState, useEffect, memo, useCallback, Suspense, lazy } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";
import { useSettings } from "@/hooks/useSettings";
import { useIntersectionObserver } from "@/hooks";
import { cn } from "@/lib/utils";

// Lazy load Globe component for better performance
const Globe = lazy(() => import("@/components/Globe"));

// Loading fallback for Globe
const GlobeFallback = () => (
  <div className="h-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full animate-pulse" />
);

// Floating background elements component
const FloatingElements = memo(() => (
  <div className="absolute inset-0 pointer-events-none ">
    <div className="absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse bg-primary-dynamic/10" />
    <div className="absolute top-40 right-32 w-24 h-24 rounded-full animate-pulse animation-delay-200 bg-primary-light/20" />
    <div className="absolute bottom-32 left-32 w-28 h-28 rounded-full animate-pulse animation-delay-400 bg-primary-lighter/20" />
    <div className="absolute bottom-20 right-20 w-20 h-20 rounded-full animate-pulse animation-delay-300 bg-primary-dynamic/10" />
  </div>
));

FloatingElements.displayName = 'FloatingElements';

// Action buttons component
const ActionButtons = memo(({ isVisible }) => (
  <div className={cn(
    "flex flex-col gap-3 md:mb-2 md:w-10/12 md:flex-row transition-all duration-500 delay-400 will-change-transform",
    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
  )}>
    <Link href="/projects" className="group">
      {/* <Button
        size="lg"
        color="white"
        className="flex justify-center items-center gap-3 hover:scale-102 hover:shadow-lg transition-all duration-300 group-hover:bg-gray-100"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:rotate-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
        View Projects
      </Button> */}
    </Link>
    <Link href="/contact" className="group">
      <Button
        size="lg"
        variant="outlined"
        color="white"
        className="flex justify-center items-center gap-3 hover:scale-102 hover:shadow-lg transition-all duration-300 group-hover:bg-white group-hover:text-gray-900"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:rotate-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        Contact Me
      </Button>
    </Link>
  </div>
));

ActionButtons.displayName = 'ActionButtons';

// Loading skeleton component
const HeroSkeleton = () => (
  <div className="relative min-h-screen w-full  bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-dynamic border-t-transparent" />
  </div>
);

const Hero = memo(() => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings, colors } = useSettings();
  
  // Intersection observers for animations with reduced sensitivity
  const { elementRef: heroContentRef, isIntersecting: heroContentVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });
  
  const { elementRef: globeRef, isIntersecting: globeVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '150px',
  });
  
  const { elementRef: bottomCardRef, isIntersecting: bottomCardVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Optimized profile fetching with error handling
  const fetchProfile = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch("/api/profile", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timeout');
      } else {
        setError(error.message || 'Failed to fetch profile');
      }
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <HeroSkeleton />;
  }

  // Use fallback data if profile fails to load
  const profileData = profile || {
    name: "Abdullah Memon",
    title: "BE Software Engineer & Full Stack Web developer",
    bio: "Welcome to my portfolio! I'm Abdullah, a passionate developer creating amazing digital experiences with modern technologies.",
  };

  return (
    <div className="relative min-h-[82vh] w-full ">
      <FloatingElements />

      <header className="grid min-h-[35rem] bg-primary-dynamic  px-6 md:px-12 lg:px-16 relative ">
        <div className="max-w-7xl mx-auto grid h-full grid-cols-1 lg:mt-12 lg:grid-cols-2 gap-8 py-6">
          {/* Content Section */}
          <div ref={heroContentRef} className="col-span-1 mt-16 space-y-6">
            <h1 className={cn(
              "text-4xl lg:text-6xl font-bold text-white leading-tight transition-all duration-500 will-change-transform",
              heroContentVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            )}>
              {profileData.name}
            </h1>
            
            <small className={cn(
              "block text-white uppercase tracking-wider transition-all duration-500 delay-100 will-change-transform",
              heroContentVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            )}>
              {profileData.title}
            </small>
            
            <p className={cn(
              "text-gray-300 text-lg md:pr-8 xl:pr-16 leading-relaxed transition-all duration-500 delay-200 will-change-transform",
              heroContentVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            )}>
              {profileData.bio}
            </p>
            
            {/* <div className="space-y-4">
             <h6 className={cn(
                "text-white text-xl font-semibold transition-all duration-500 delay-300 will-change-transform",
                heroContentVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
              )}>
                Get in touch
              </h6>
              
              <ActionButtons isVisible={heroContentVisible} />
            </div> */}
            
            {/* {error && (
              <div className="text-yellow-400 text-sm mt-4 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20 max-w-md">
                ⚠️ Profile data couldn't be loaded. Using fallback content.
              </div>
            )} */}
          </div>

          {/* Globe Section */}
          <div ref={globeRef} className={cn(
            "col-span-1 flex justify-center transition-all duration-500 delay-300 sm:-mt-40",
            globeVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          )}>
            <div className="my-8 h-full lg:my-0 lg:ml-auto w-full max-w-md">
              <Suspense fallback={<GlobeFallback />}>
                <Globe primaryColor={colors.primary} />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Card Section */}
      <div ref={bottomCardRef} className={cn(
        " -m-36 rounded-xl bg-white dark:bg-gray-800 p-6 md:p-8 lg:p-10 shadow-md border border-gray-200 dark:border-gray-700 relative z-20 max-w-6xl xl:max-w-7xl mx-auto mb-10",
        "mx-6 md:mx-12 lg:mx-16 xl:mx-20",
        bottomCardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      )}>
        <div className="space-y-6">
          <div className={cn(
            "transition-all duration-500 delay-100 will-change-transform",
            bottomCardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'
          )}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Portfolio Showcase
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-4xl">
              Explore my collection of projects built with modern technologies
              including React, Next.js, and various other cutting-edge tools and
              frameworks. Each project demonstrates my commitment to clean code,
              user experience, and innovative solutions.
            </p>
          </div>
          
          <div className={cn(
            "flex flex-wrap gap-4 pt-4 transition-all duration-500 delay-200 will-change-transform",
            bottomCardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'
          )}>
            <Link href="/projects" className="group">
              <Button
                size="md"
                className="bg-primary-dynamic hover:bg-primary-dark text-white flex items-center gap-2 transition-all duration-300 hover:scale-102"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
                View All Projects
              </Button>
            </Link>
            
            <Link href="/about" className="group">
              <Button
                size="md"
                variant="outlined"
                className="border-primary-dynamic text-primary-dynamic hover:bg-primary-dynamic hover:text-white flex items-center gap-2 transition-all duration-300 hover:scale-102"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;
