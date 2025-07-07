"use client";

import React from "react";
import Image from "next/image";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

export function TestimonialCard({
  img,
  feedback,
  client,
  title,
  rating = 5,
  featured = false,
}) {
  const { getRingColorClass, getBadgeColorClass } = usePrimaryColor();

  // Render star rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card 
      shadow={false} 
      className={`items-center text-center transition-all duration-300 hover:shadow-lg ${
        featured ? `ring-2 ${getRingColorClass()} ring-opacity-50` : ''
      }`}
    >
      <CardBody>
        {/* Avatar with fallback */}
        {img ? (
          <div className="mb-3 mx-auto w-16 h-16 relative">
            <Image
              src={img}
              alt={client}
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-16 h-16 bg-gray-200 rounded-full items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="mb-3 mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Client name with featured badge */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Typography variant="h6" color="blue-gray">
            {client}
          </Typography>
          {featured && (
            <span className={`${getBadgeColorClass()} text-xs font-medium px-2 py-1 rounded-full`}>
              Featured
            </span>
          )}
        </div>
        
        <Typography variant="small" className="mb-3 font-medium !text-gray-700">
          {title}
        </Typography>
        
        {/* Star rating */}
        <div className="flex justify-center gap-1 mb-4">
          {renderStars()}
        </div>
        
        <Typography
          variant="paragraph"
          className="mb-5 font-normal !text-gray-500"
        >
          &quot;{feedback}&quot;
        </Typography>
      </CardBody>
    </Card>
  );
}

export default TestimonialCard;
