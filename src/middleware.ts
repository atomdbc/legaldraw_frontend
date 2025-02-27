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
  '/settings',
  '/quick-documents',
  '/quick-documents/create',
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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

  // Quick documents type validation
  if (pathname === '/quick-documents/create') {
    const type = searchParams.get('type');
    if (!type || !DOCUMENT_TYPES.includes(type as any)) {
      return NextResponse.redirect(new URL('/quick-documents', request.url));
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
    return NextResponse.next();
  }

  // Protected routes handling
  if (authRequiredPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the original URL as a redirect parameter
      loginUrl.searchParams.set('redirect', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp || decoded.exp <= Date.now() / 1000) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/documents/create/:type*',
    '/quick-documents/create'
  ]
};