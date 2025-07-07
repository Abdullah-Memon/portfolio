'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [primaryColorClass, setPrimaryColorClass] = useState('teal');
  const { settings, colors } = useSettings();

  useEffect(() => {
    // Always default to light mode - ignore browser preferences
    const savedTheme = localStorage.getItem('theme');
    
    // Force light mode regardless of browser preference or saved theme
    setIsDark(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    // Update primary color when settings change
    if (settings?.primaryColor) {
      setPrimaryColorClass(settings.primaryColor);
      
      // Remove existing primary color classes from document
      const existingClasses = document.documentElement.className.split(' ').filter(cls => 
        !cls.startsWith('primary-')
      );
      
      // Add new primary color class
      document.documentElement.className = [...existingClasses, `primary-${settings.primaryColor}`].join(' ');
      
      // Update CSS custom properties for dynamic colors
      updateCSSCustomProperties(colors);
    }
  }, [settings?.primaryColor, colors]);

  const updateCSSCustomProperties = (colorValues) => {
    if (!colorValues) return;
    
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colorValues.primary);
    root.style.setProperty('--color-primary-light', colorValues.light);
    root.style.setProperty('--color-primary-lighter', colorValues.lighter);
    root.style.setProperty('--color-primary-lightest', colorValues.lightest);
    
    // Convert hex to RGB for opacity variations
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const primaryRgb = hexToRgb(colorValues.primary);
    if (primaryRgb) {
      root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
  };

  const toggleTheme = () => {
    // Theme toggle disabled - always stay in light mode
    console.log('Theme toggle is disabled - application stays in light mode');
    return;
  };

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      primaryColorClass, 
      colors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
