const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/lib/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Dynamic primary colors that can be overridden via CSS variables
        'primary-dynamic': 'var(--color-primary, #14b8a6)',
        'primary-light': 'var(--color-primary-light, #2dd4bf)',
        'primary-lighter': 'var(--color-primary-lighter, #5eead4)',
        'primary-lightest': 'var(--color-primary-lightest, #ccfbf1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Add plugins when needed/installed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
  // Performance optimizations
  corePlugins: {
    preflight: true,
  },
  // Safelist for dynamic classes
  safelist: [
    // Primary color variations
    {
      pattern: /bg-(primary|blue|teal|green|purple|red|orange|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'active', 'dark'],
    },
    {
      pattern: /text-(primary|blue|teal|green|purple|red|orange|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'active', 'dark'],
    },
    {
      pattern: /border-(primary|blue|teal|green|purple|red|orange|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'active', 'dark'],
    },
    // Animation classes
    'animate-fade-in',
    'animate-slide-up',
    'animate-slide-down',
    'animate-scale-in',
    'animate-spin-slow',
    'animate-pulse-fast',
    // Dynamic primary classes
    'bg-primary-dynamic',
    'text-primary-dynamic',
    'border-primary-dynamic',
    'bg-primary-light',
    'bg-primary-lighter',
    'bg-primary-lightest',
    'hover:bg-primary-dynamic',
    'hover:text-primary-dynamic',
    'btn-primary',
    'btn-primary-outline',
  ],
});
