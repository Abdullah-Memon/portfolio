import { Roboto, Inter, Poppins } from 'next/font/google';

// Primary font - Optimized loading
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Secondary font for headings
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  preload: false, // Only load when needed
  fallback: ['system-ui', 'arial'],
});

// Accent font for special elements
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

// Font class names for easy use
export const fontClassNames = {
  roboto: roboto.className,
  inter: inter.className,
  poppins: poppins.className,
  variable: `${roboto.variable} ${inter.variable} ${poppins.variable}`,
};

export default roboto;
