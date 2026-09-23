import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (session.role === 'sales' && pathname === '/admin') {
    const leadsUrl = new URL('/admin/leads', request.url);
    return NextResponse.redirect(leadsUrl);
  }
  
  return NextResponse.next();
}

// Configure middleware to match /admin and all its sub-paths
export const config = {
  matcher: '/admin/:path*',
};
