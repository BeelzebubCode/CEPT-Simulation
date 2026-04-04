import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself (avoid redirect loop)
  if (pathname === '/admin/login') return NextResponse.next();

  const rawToken = request.cookies.get(COOKIE_NAME)?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;
  const authenticated = token ? await verifyToken(token) : false;

  if (!authenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect all /admin/* routes (pages only — API routes guard themselves)
  matcher: ['/admin/:path*'],
};