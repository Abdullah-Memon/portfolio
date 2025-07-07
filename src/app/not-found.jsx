'use client';

import Container from '@/components/ui/Container';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Container className="max-w-md w-full text-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              404
            </h1>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Page not found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/">
              <Button color="teal" className="w-full">
                Go back home
              </Button>
            </Link>
            <Link href="/posts">
              <Button variant="outlined" color="teal" className="w-full">
                Browse posts
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
