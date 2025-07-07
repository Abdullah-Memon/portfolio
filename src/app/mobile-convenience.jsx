"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import InfoCard from "@/components/shared/info-card";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { DynamicStatisticsSVG } from "@/components";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Default options as fallback
const DEFAULT_OPTIONS = [
  {
    title: "50+",
    description: "Projects Completed",
  },
  {
    title: "3+",
    description: "Years Experience",
  },
  {
    title: "24/7",
    description: "Availability",
  },
  {
    title: "100%",
    description: "Client Satisfaction",
  },
];

export function MobileConvenience() {
  const [statistics, setStatistics] = useState([])
  const [loading, setLoading] = useState(true)
  
  const sectionObserver = useIntersectionObserver({ threshold: 0.2 })
  const svgObserver = useIntersectionObserver({ threshold: 0.3 })
  const cardsObserver = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch('/api/statistics')
        if (response.ok) {
          const data = await response.json()
          setStatistics(data.statistics || [])
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        // Use default options as fallback
        setStatistics([])
      } finally {
        setLoading(false)
      }
    }
    fetchStatistics()
  }, [])

  // Use dynamic statistics if available, otherwise use default options
  const displayOptions = statistics.length > 0 
    ? statistics.map(stat => ({
        title: `${stat.value}${stat.suffix || ''}`,
        description: stat.label,
        icon: stat.icon
      }))
    : DEFAULT_OPTIONS

  return (
    <section ref={sectionObserver.ref} className="py-20 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        <div 
          ref={svgObserver.ref}
          className={`transition-all duration-700 ${svgObserver.isVisible ? 'animate-fade-in-left' : 'opacity-0 -translate-x-8'}`}
        >
          <DynamicStatisticsSVG
            className="my-20 h-full -translate-y-32 lg:my-0 lg:ml-auto lg:translate-y-0 hover-scale transition-transform duration-700"
            alt="portfolio statistics illustration"
          />
        </div>
        <div className={`col-span-1 mx-auto max-w-lg px-4 lg:px-0 transition-all duration-700 delay-200 ${sectionObserver.isVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-8'}`}>
          <Typography variant="h2" color="blue-gray" className="mb-4 heading-dark heading-primary">
            Portfolio Statistics
          </Typography>
          <Typography
            variant="lead"
            className="mb-5 px-4 text-left text-xl text-contrast lg:px-0"
          >
            A track record of successful projects and satisfied clients.
          </Typography>

          <div ref={cardsObserver.ref} className="col-span-2 grid gap-5 grid-cols-2">
            {displayOptions.map(({ title, description, icon }, index) => (
              <div 
                key={`${title}-${description}`}
                className={`transition-all duration-700 ${cardsObserver.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                style={{transitionDelay: cardsObserver.isVisible ? `${index * 0.1}s` : '0s'}}
              >
                <InfoCard title={title}>
                  {description}
                </InfoCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default MobileConvenience;
