"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import TestimonialCard from "@/components/shared/testimonial-card";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getSpinnerColorClass, getBgColorClass, getButtonColorClass } = usePrimaryColor();
  
  const headerSection = useIntersectionObserver({ threshold: 0.2 })
  const cardsSection = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Fetch only 6 testimonials for home page
      const response = await fetch('/api/testimonials?published=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        // Handle both array response (non-paginated) and object response (paginated)
        const testimonialsArray = Array.isArray(data) ? data : (data.testimonials || []);
        setTestimonials(testimonialsArray);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setTestimonials([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="px-10 !py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getSpinnerColorClass()}`}></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-10 !py-20">
      <div className="container mx-auto">
        <div ref={headerSection.ref} className="mb-20 flex w-full flex-col items-center">
          <div className={`mb-10 flex h-12 w-12 items-center justify-center rounded-lg ${getBgColorClass()} text-white transition-all duration-700 ${headerSection.isVisible ? 'animate-fade-in-down' : 'opacity-0 -translate-y-8'}`}>
            <UserIcon className="h-6 w-6" />
          </div>
          <Typography 
            variant="h2" 
            className={`mb-2 heading-dark heading-primary transition-all duration-700 delay-200 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            Client Testimonials
          </Typography>
          <Typography
            variant="lead"
            className={`mb-10 max-w-3xl text-center text-contrast transition-all duration-700 delay-300 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            See what clients say about working with me. I take pride in 
            delivering high-quality solutions and building lasting professional relationships.
          </Typography>
        </div>
        
        {(!testimonials || testimonials.length === 0) ? (
          <div className="text-center py-12">
            <Typography color="gray">
              No testimonials available yet.
            </Typography>
          </div>
        ) : (
          <>
            <div ref={cardsSection.ref} className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 lg:px-20">
              {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-700 ${cardsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: cardsSection.isVisible ? `${index * 0.1}s` : '0s'}}
                >
                  <TestimonialCard 
                    client={testimonial.clientName}
                    title={`${testimonial.clientTitle}${testimonial.company ? ` @ ${testimonial.company}` : ''}`}
                    feedback={testimonial.feedback}
                    img={testimonial.avatarUrl}
                    rating={testimonial.rating}
                    featured={testimonial.featured}
                  />
                </div>
              ))}
            </div>
            
            {/* View All Testimonials Button */}
            {testimonials.length === 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => router.push('/reviews')}
                  className={`px-8 py-3 ${getButtonColorClass()} text-white font-medium rounded-lg transition-colors duration-200 hover-scale`}
                >
                  View All Testimonials
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
export default Testimonials;
