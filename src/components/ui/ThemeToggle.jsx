'use client';

import { IconButton } from '@material-tailwind/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <IconButton
      variant="text"
      color={isDark ? 'white' : 'blue-gray'}
      onClick={toggleTheme}
      className={`transition-colors duration-200 ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </IconButton>
  );
}
