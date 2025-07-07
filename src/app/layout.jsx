import './globals.css';
import { roboto, fontClassNames } from '@/lib/fonts';
import { Layout } from '@/components';
import AuthProvider from '@/components/providers/AuthProvider';
import PrimaryColorProvider from '@/components/providers/PrimaryColorProvider';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';

// Conditional imports for analytics (only if available)
let Analytics, SpeedInsights;
try {
  Analytics = require('@vercel/analytics/react').Analytics;
  SpeedInsights = require('@vercel/speed-insights/next').SpeedInsights;
} catch (e) {
  // Analytics packages not available in development
  Analytics = () => null;
  SpeedInsights = () => null;
}

export const metadata = {
  title: {
    default: 'Abdullah Memon - Full Stack Developer',
    template: '%s | Abdullah Memon',
  },
  description:
    'Portfolio of Abdullah Memon, a passionate full-stack developer specializing in React, Next.js, Node.js, and modern web technologies.',
  keywords: [
    'Abdullah Memon',
    'Full Stack Developer',
    'React',
    'Next.js',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Portfolio',
  ],
  authors: [{ name: 'Abdullah Memon' }],
  creator: 'Abdullah Memon',
  publisher: 'Abdullah Memon',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abdullahmemon.dev',
    title: 'Abdullah Memon - Full Stack Developer',
    description: 'Portfolio of Abdullah Memon, a passionate full-stack developer',
    siteName: 'Abdullah Memon Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdullah Memon - Full Stack Developer',
    description: 'Portfolio of Abdullah Memon, a passionate full-stack developer',
    creator: '@abdullahmemon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontClassNames.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        
        {/* Force light mode script - runs before any CSS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove dark class immediately
                document.documentElement.classList.remove('dark');
                // Force light mode
                document.documentElement.style.colorScheme = 'light';
                // Override any existing theme preference
                try {
                  localStorage.setItem('theme', 'light');
                } catch (e) {}
                // Prevent dark mode media query from applying
                const style = document.createElement('style');
                style.textContent = \`
                  @media (prefers-color-scheme: dark) {
                    :root { color-scheme: light !important; }
                  }
                \`;
                document.head.appendChild(style);
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Optimized Font Awesome loading */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </noscript>
      </head>
      <body className={`${roboto.className}`} suppressHydrationWarning style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}>
          <AuthProvider>
            <PrimaryColorProvider>
              <Layout>{children}</Layout>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    padding: '12px 16px',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4aed88',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </PrimaryColorProvider>
          </AuthProvider>
        </Suspense>
        
        {/* Analytics and Performance Monitoring */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
