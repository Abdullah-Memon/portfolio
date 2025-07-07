"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

import {
  CursorArrowRaysIcon,
  HeartIcon,
  LightBulbIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import FeatureCard from "@/components/shared/feature-card";
import { Container } from "@/components";

const FEATURES = [
  {
    icon: CursorArrowRaysIcon,
    title: "Modern Technologies",
    children:
      "Built with cutting-edge technologies like React, Next.js, and Tailwind CSS for optimal performance and user experience.",
  },
  {
    icon: HeartIcon,
    title: "Responsive Design",
    children:
      "Fully responsive designs that look great on all devices, from mobile phones to desktop computers.",
  },
  {
    icon: LockClosedIcon,
    title: "Performance Optimized",
    children:
      "Fast loading times and optimized code ensure the best user experience across all platforms.",
  },
  {
    icon: LightBulbIcon,
    title: "Creative Solutions",
    children:
      "Innovative and creative approaches to solving complex problems with clean, maintainable code.",
  },
];

export function Features() {
  const headerSection = useIntersectionObserver({ threshold: 0.2 })
  const cardsSection = useIntersectionObserver({ threshold: 0.1 })

  return (
    <Container>
      <section className="py-28 px-4">
      <div ref={headerSection.ref} className="container mx-auto mb-20 text-center">
        <Typography 
          color="blue-gray" 
          className={`mb-2 font-bold uppercase text-muted transition-all duration-700 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
        >
          Abdullah&apos;s Skills
        </Typography>
        <Typography 
          variant="h1" 
          className={`mb-4 heading-dark heading-primary transition-all duration-700 delay-200 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
        >
          Technical Expertise
        </Typography>
        <Typography
          variant="lead"
          className={`mx-auto w-full px-4 text-contrast lg:w-11/12 lg:px-8 transition-all duration-700 delay-300 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
        >
          Passionate about creating exceptional digital experiences using modern 
          web technologies and best practices in software development.
        </Typography>
      </div>
      <div ref={cardsSection.ref} className="container mx-auto grid max-w-6xl grid-cols-1 gap-4 gap-y-12 md:grid-cols-2">
        {FEATURES.map((props, idx) => (
          <div 
            key={idx}
            className={`transition-all duration-700 ${cardsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
            style={{transitionDelay: cardsSection.isVisible ? `${idx * 0.1}s` : '0s'}}
          >
            <FeatureCard {...props} />
          </div>
        ))}
      </div>
    </section>
    </Container>
  );
}
export default Features;
