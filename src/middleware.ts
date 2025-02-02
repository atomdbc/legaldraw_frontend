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
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api')
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
    return NextResponse.next();
  }

  // Special handling for logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  // Document type validation for create routes
  if (pathname.startsWith('/documents/create/')) {
    const segments = pathname.split('/');
    const type = segments[3];
    
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
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
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

  // Updated Content Security Policy to include auth server
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://cdnjs.cloudflare.com",
    // Add localhost:8000 and your production auth server to connect-src
    "connect-src 'self' https://api.legaldraw.com https://*.geonames.org https://secure.geonames.org ws://localhost:* wss://localhost:* http://localhost:8000 https://your-production-auth-server.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "worker-src 'self' blob:"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/documents/create/:type*'
  ]
};