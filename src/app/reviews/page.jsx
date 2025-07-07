'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';
import TestimonialCard from '@/components/shared/testimonial-card';
import Container from '@/components/ui/Container';
import Pagination from '@/components/ui/Pagination';

export default function ReviewsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  const headerSection = useIntersectionObserver({ threshold: 0.2 });
  const cardsSection = useIntersectionObserver({ threshold: 0.1 });
  const { getTextColorClass, getHoverTextColorClass, getBgColorClass, getSpinnerColorClass, getRingColorClass } = usePrimaryColor();

  const TESTIMONIALS_PER_PAGE = 9;

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        published: 'true',
        page: currentPage.toString(),
        limit: TESTIMONIALS_PER_PAGE.toString()
      });

      const response = await fetch(`/api/testimonials?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (data.testimonials) {
          // Paginated response
          setTestimonials(data.testimonials);
          setPagination(data.pagination);
        } else {
          // Non-paginated response (fallback)
          setTestimonials(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gray-900 dark:bg-gray-800 pt-20 pb-16">
          <Container className="py-12">
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-white`}></div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gray-900 dark:bg-gray-800 pt-20 pb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-16 w-24 h-24 bg-primary-10 rounded-full animate-float"></div>
          <div className={`absolute bottom-16 right-16 w-32 h-32 ${getBgColorClass()}/10 rounded-full animate-float animate-delay-300`}></div>
        </div>
        
        <Container className="py-12 relative z-10">
          <div ref={headerSection.ref} className="text-center">
            {/* Back Button */}
            {/* <button
              onClick={() => window.history.back()}
              className={`mb-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 ${headerSection.isVisible ? 'animate-fade-in-left' : 'opacity-0 -translate-x-8'} mx-auto`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </button> */}

            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${getBgColorClass()}/20 text-white mx-auto transition-all duration-700 ${headerSection.isVisible ? 'animate-fade-in-down' : 'opacity-0 -translate-y-8'}`}>
              <UserIcon className="h-8 w-8" />
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-6 heading-primary transition-all duration-700 delay-200 ${headerSection.isVisible ? 'animate-fade-in-down' : 'opacity-0 translate-y-8'}`}>
              Client Reviews & Testimonials
            </h1>
            
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
              Read what clients say about working with me. Discover testimonials and reviews from satisfied clients across various projects and collaborations.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content Section */}
      <Container className="py-12">
        {/* Stats Section */}
        <div className={`flex justify-center gap-8 mb-12 transition-all duration-700 delay-400 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <Typography variant="h3" className="text-gray-900 dark:text-white font-bold">
              {pagination.total || testimonials.length}
            </Typography>
            <Typography color="gray" className="text-sm">
              Total Reviews
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" className="text-gray-900 dark:text-white font-bold">
              {testimonials.length > 0 
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : '0'}
            </Typography>
            <Typography color="gray" className="text-sm">
              Average Rating
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" className="text-gray-900 dark:text-white font-bold">
              {testimonials.filter(t => t.featured).length}
            </Typography>
            <Typography color="gray" className="text-sm">
              Featured
            </Typography>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray" className="mb-2">
                No testimonials available
              </Typography>
              <Typography color="gray">
                Check back later for client reviews and testimonials.
              </Typography>
            </CardBody>
          </Card>
        ) : (
          <div ref={cardsSection.ref} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
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
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={TESTIMONIALS_PER_PAGE}
              onPageChange={handlePageChange}
              showInfo={true}
              showQuickJump={pagination.pages > 10}
              className="justify-center"
            />
          </div>
        )}

        {/* Call to Action */}
        {testimonials.length > 0 && (
          <div className="text-center mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
            <Typography variant="h4" className="mb-4 text-gray-900 dark:text-white">
              Ready to Work Together?
            </Typography>
            <Typography className="mb-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Join these satisfied clients and let&apos;s create something amazing together. 
              I&apos;m always excited to take on new challenges and deliver exceptional results.
            </Typography>
            <button
              onClick={() => window.location.href = '/contact'}
              className={`px-8 py-3 ${getBgColorClass()} ${getHoverTextColorClass()} text-white font-medium rounded-lg transition-all duration-200 hover-scale transform hover:scale-105`}
            >
              Start Your Project
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
