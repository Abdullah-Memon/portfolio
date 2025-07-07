'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function PrimaryColorProvider({ children }) {
  const { settings, colors, loading } = useSettings();

  useEffect(() => {
    if (!loading && colors) {
      const root = document.documentElement;
      
      // Set CSS custom properties for primary colors
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-primary-light', colors.light);
      root.style.setProperty('--color-primary-lighter', colors.lighter);
      root.style.setProperty('--color-primary-lightest', colors.lightest);
      
      // Convert hex to RGB for opacity variations
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const primaryRgb = hexToRgb(colors.primary);
      if (primaryRgb) {
        root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      }

      // Add primary color class to html element for CSS targeting
      const existingClasses = root.className.split(' ').filter(cls => 
        !cls.startsWith('primary-')
      );
      root.className = [...existingClasses, `primary-${settings?.primaryColor || 'teal'}`].join(' ');
    }
  }, [settings?.primaryColor, colors, loading]);

  return children;
}
