"use client";

import React, { Suspense, lazy, memo } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider as MTThemeProvider } from "@material-tailwind/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Lazy load components for better performance
const Navbar = lazy(() => import("../navbar"));
const Footer = lazy(() => import("../footer").then(module => ({ default: module.Footer })));

// Loading fallbacks
const NavbarFallback = () => (
  <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" />
);

const FooterFallback = () => (
  <div className="h-32 bg-gray-50 dark:bg-gray-800" />
);

const Layout = memo(function Layout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <ThemeProvider>
      <MTThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 font-roboto">
            {!isAdminPage && (
              <Suspense fallback={<NavbarFallback />}>
                <Navbar />
              </Suspense>
            )}
            
            <main className="relative">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            
            {!isAdminPage && (
              <Suspense fallback={<FooterFallback />}>
                <Footer />
              </Suspense>
            )}
          </div>
        </ErrorBoundary>
      </MTThemeProvider>
    </ThemeProvider>
  );
});

export { Layout };
export default Layout;
