// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';

const publicPaths = ['/login', '/register', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Document type validation for create routes
  if (pathname.startsWith('/documents/create/')) {
    const segments = pathname.split('/');
    const type = segments[3]; // ["", "documents", "create", "type", ...]
    
    if (!DOCUMENT_TYPES.includes(type as any)) {
      return NextResponse.redirect(new URL('/documents/create', request.url));
    }
  }

  // Always allow public paths
  if (publicPaths.includes(pathname)) {
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

  // Protected routes
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/documents/create/:type*'
  ]
};