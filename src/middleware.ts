import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME, verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const raw = request.cookies.get(COOKIE_NAME)?.value;
    const valid = raw ? await verifyToken(decodeURIComponent(raw)) : false;
    if (!valid) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
