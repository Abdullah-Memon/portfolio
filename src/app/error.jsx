'use client';

import Container from '@/components/ui/Container';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';

export default function Error500() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Container className="max-w-md w-full text-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              500
            </h1>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Server Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Something went wrong on our end. Please try again later.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/">
              <Button color="teal" className="w-full">
                Go back home
              </Button>
            </Link>
            <Button 
              variant="outlined" 
              color="teal" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
