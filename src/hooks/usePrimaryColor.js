'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/hooks/useSettings';

export function usePrimaryColor() {
  const { primaryColorClass, colors } = useTheme(); // Removed isDark
  const { settings } = useSettings();

  // Map colors to their Tailwind class equivalents
  const getColorClass = (variant = '500', type = 'bg') => {
    const colorName = primaryColorClass || settings?.primaryColor || 'teal';
    return `${type}-${colorName}-${variant}`;
  };

  // Get Material Tailwind compatible color name
  const getMaterialTailwindColor = () => {
    const colorMap = {
      'teal': 'teal',
      'blue': 'blue',
      'green': 'green',
      'purple': 'purple',
      'red': 'red',
      'orange': 'orange',
      'pink': 'pink',
      'indigo': 'indigo'
    };
    
    return colorMap[primaryColorClass || settings?.primaryColor] || 'teal';
  };

  // Get primary button classes
  const getPrimaryButtonClasses = () => {
    return `btn-primary`;
  };

  // Get outline button classes
  const getOutlineButtonClasses = () => {
    return `btn-primary-outline`;
  };

  // Get dynamic styles for inline usage
  const getPrimaryStyles = () => ({
    color: colors?.primary || '#14b8a6',
    backgroundColor: colors?.primary || '#14b8a6',
    borderColor: colors?.primary || '#14b8a6',
  });

  const getPrimaryStylesLight = () => ({
    color: colors?.light || '#2dd4bf',
    backgroundColor: colors?.light || '#2dd4bf',
    borderColor: colors?.light || '#2dd4bf',
  });

  // Get loading spinner classes with primary color
  const getLoadingSpinnerClasses = () => {
    return `border-primary`;
  };

  // Get hover glow classes
  const getGlowClasses = () => {
    return `hover:glow-primary`;
  };

  // Specific utility functions used in components
  const getBgColorClass = (variant = '600') => {
    return getColorClass(variant, 'bg');
  };

  const getTextColorClass = (variant = '600') => {
    return getColorClass(variant, 'text');
  };

  const getHoverTextColorClass = (variant = '600') => {
    return `hover:${getColorClass(variant, 'text')}`;
  };

  const getBorderColorClass = (variant = '500') => {
    return getColorClass(variant, 'border');
  };

  const getFocusBorderColorClass = (variant = '500') => {
    return `focus:${getColorClass(variant, 'border')}`;
  };

  const getRingColorClass = (variant = '500') => {
    return `focus:ring-${primaryColorClass || settings?.primaryColor || 'teal'}-${variant}`;
  };

  const getSpinnerColorClass = (variant = '600') => {
    return `border-${primaryColorClass || settings?.primaryColor || 'teal'}-${variant}`;
  };

  const getButtonColorClass = () => {
    const colorName = primaryColorClass || settings?.primaryColor || 'teal';
    return `bg-${colorName}-600 hover:bg-${colorName}-700`;
  };

  const getBadgeColorClass = () => {
    const colorName = primaryColorClass || settings?.primaryColor || 'teal';
    return `bg-${colorName}-100 text-${colorName}-800`; // Only light mode classes
  };

  return {
    // Utility functions
    getColorClass,
    getMaterialTailwindColor,
    getPrimaryButtonClasses,
    getOutlineButtonClasses,
    getPrimaryStyles,
    getPrimaryStylesLight,
    getLoadingSpinnerClasses,
    getGlowClasses,
    
    // Specific component utility functions
    getBgColorClass,
    getTextColorClass,
    getHoverTextColorClass,
    getBorderColorClass,
    getFocusBorderColorClass,
    getRingColorClass,
    getSpinnerColorClass,
    getButtonColorClass,
    getBadgeColorClass,
    
    // Direct class names
    primary: {
      bg: 'bg-primary',
      text: 'text-primary',
      border: 'border-primary',
      bgLight: 'bg-primary-light',
      bgLighter: 'bg-primary-lighter',
      bgLightest: 'bg-primary-lightest',
      bg10: 'bg-primary-10',
      bg20: 'bg-primary-20',
      bg30: 'bg-primary-30',
    },
    
    hover: {
      bg: 'hover:bg-primary',
      text: 'hover:text-primary',
      bgLight: 'hover:bg-primary-light',
      glow: 'hover:glow-primary',
    },
    
    // Color values for direct use
    colors,
    colorName: primaryColorClass || settings?.primaryColor || 'teal',
    // isDark removed - always light mode
  };
}
