'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showQuickJump = false,
  className = '',
  size = 'medium' // small, medium, large
}) {
  const { getBgColorClass, getTextColorClass, getHoverTextColorClass, getRingColorClass } = usePrimaryColor();

  if (totalPages <= 1) return null;

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  const iconSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleQuickJump = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(e.target.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        e.target.blur();
      }
    }
  };

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {/* Items Info */}
      {showInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            ${sizeClasses[size]} border border-gray-300 dark:border-gray-600 rounded-lg
            font-medium transition-all duration-200 flex items-center gap-1
            ${currentPage === 1 
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800' 
              : `text-gray-700 dark:text-gray-300 ${getHoverTextColorClass()} dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-700`
            }
          `}
        >
          <ChevronLeftIcon className={iconSizeClasses[size]} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className={`${sizeClasses[size]} text-gray-400 dark:text-gray-500`}>
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`
                    ${sizeClasses[size]} border rounded-lg font-medium transition-all duration-200
                    ${page === currentPage
                      ? `${getBgColorClass()} text-white border-transparent shadow-sm`
                      : `text-gray-700 dark:text-gray-300 ${getHoverTextColorClass()} dark:hover:text-primary-400 
                         border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 
                         bg-white dark:bg-gray-700`
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            ${sizeClasses[size]} border border-gray-300 dark:border-gray-600 rounded-lg
            font-medium transition-all duration-200 flex items-center gap-1
            ${currentPage === totalPages 
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800' 
              : `text-gray-700 dark:text-gray-300 ${getHoverTextColorClass()} dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-700`
            }
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className={iconSizeClasses[size]} />
        </button>

        {/* Quick Jump */}
        {showQuickJump && totalPages > 10 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              placeholder={currentPage.toString()}
              onKeyDown={handleQuickJump}
              className={`
                w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 ${getRingColorClass()} focus:border-transparent
              `}
            />
          </div>
        )}
      </div>
    </div>
  );
}
