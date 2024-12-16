import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  if (request.nextUrl.pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL(userRole === 'admin' ? '/dashboard' : '/', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};

