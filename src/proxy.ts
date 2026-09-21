import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the user_role cookie
  const userRole = request.cookies.get('user_role')?.value;
  
  // If no user_role cookie exists, redirect to login
  if (!userRole) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is sales and trying to access /admin (package CMS), redirect to /admin/leads
  if (userRole === 'sales' && pathname === '/admin') {
    const leadsUrl = new URL('/admin/leads', request.url);
    return NextResponse.redirect(leadsUrl);
  }
  
  return NextResponse.next();
}

// Configure middleware to match /admin and all its sub-paths
export const config = {
  matcher: '/admin/:path*',
};
