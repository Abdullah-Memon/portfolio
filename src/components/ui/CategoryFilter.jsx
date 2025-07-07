'use client';

import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function CategoryFilter({
  categories = ['All'],
  selectedCategory = 'All',
  onCategoryChange,
  showFeaturedToggle = false,
  showFeaturedOnly = false,
  onFeaturedToggle,
  className = '',
  buttonSize = 'medium' // small, medium, large
}) {
  const { getBgColorClass, getTextColorClass, getHoverTextColorClass } = usePrimaryColor();

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              ${sizeClasses[buttonSize]} font-medium rounded-full transition-all duration-200 
              transform hover:scale-105 border
              ${selectedCategory === category
                ? `${getBgColorClass()} text-white shadow-lg border-transparent`
                : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                   ${getHoverTextColorClass()} border-gray-300 dark:border-gray-600 
                   hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md`
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Toggle */}
      {showFeaturedToggle && (
        <button
          onClick={onFeaturedToggle}
          className={`
            ${sizeClasses[buttonSize]} font-medium rounded-full transition-all duration-200 
            transform hover:scale-105 border flex items-center gap-2
            ${showFeaturedOnly
              ? `${getBgColorClass()} text-white shadow-lg border-transparent`
              : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                 ${getHoverTextColorClass()} border-gray-300 dark:border-gray-600 
                 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md`
            }
          `}
        >
          <span className={`text-xs ${showFeaturedOnly ? 'text-white' : 'text-yellow-500'}`}>
            ⭐
          </span>
          {showFeaturedOnly ? 'Show All' : 'Featured Only'}
        </button>
      )}
    </div>
  );
}
