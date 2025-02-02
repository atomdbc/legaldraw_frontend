import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';

const publicPaths = [
  '/',          // Landing page
  '/login',     
  '/register',
  '/reset-password',
  '/logout',    // Add logout as a public path
  // Add any other public paths here
];

const authRequiredPaths = [
  '/dashboard',
  '/documents',
  '/settings'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    !request.headers.get('x-forwarded-proto')?.includes('https') &&
    !pathname.startsWith('/_next') && // Exclude Next.js internal routes
    !pathname.startsWith('/api')    // Exclude API routes
  ) {
    const newUrl = `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(newUrl, 301);
  }

  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('favicon.ico')
  ) {
    const response = NextResponse.next();
    
    // Add security headers for API routes
    if (pathname.startsWith('/api')) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
    }
    
    return response;
  }

  // Special handling for logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear auth cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  // Document type validation for create routes
  if (pathname.startsWith('/documents/create/')) {
    const segments = pathname.split('/');
    const type = segments[3]; // ["", "documents", "create", "type", ...]
    
    if (!DOCUMENT_TYPES.includes(type as any)) {
      return NextResponse.redirect(new URL('/documents/create', request.url));
    }
  }

  // Check if the path is public
  if (publicPaths.some(path => pathname === path)) {
    const token = request.cookies.get('accessToken')?.value;
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.exp && decoded.exp > Date.now() / 1000) {
          // If user is already authenticated, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        return NextResponse.next();
      }
    }
    
    // Add security headers for public routes
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Protected routes handling
  if (authRequiredPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp || decoded.exp <= Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Add security headers for all other routes
  const response = NextResponse.next();
  
  // Security Headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://cdnjs.cloudflare.com",
      "connect-src 'self' https://secure.geonames.org",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'"
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/documents/create/:type*'
  ]
};