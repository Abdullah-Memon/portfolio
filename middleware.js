import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { rateLimit } from './src/lib/rate-limit';

// Security middleware with rate limiting and enhanced protection
export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const clientIP = req.ip ?? '127.0.0.1';
    
    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
      try {
        await rateLimit(clientIP);
      } catch {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }
    
    // Additional rate limiting for admin actions
    if (pathname.startsWith('/api/admin/')) {
      try {
        await rateLimit(clientIP, { limit: 20, window: 900000 }); // 20 requests per 15 minutes
      } catch {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }
    
    // Allow access to admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if user has admin role for other admin pages
    if (pathname.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Add security headers
    const response = NextResponse.next();
    
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy (formerly Feature Policy)
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to admin login page without authentication
        if (pathname === '/admin/login') {
          return true;
        }
        
        // For other admin pages, require authentication
        if (pathname.startsWith('/admin')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
