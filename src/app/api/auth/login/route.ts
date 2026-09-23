import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { timingSafeEqual } from 'node:crypto';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  UserRole,
} from '@/lib/session';

function matchesPasscode(candidate: string, expected?: string) {
  if (!expected) return false;

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  const comparisonLength = Math.max(candidateBuffer.length, expectedBuffer.length);
  const paddedCandidate = Buffer.alloc(comparisonLength);
  const paddedExpected = Buffer.alloc(comparisonLength);
  candidateBuffer.copy(paddedCandidate);
  expectedBuffer.copy(paddedExpected);

  const matches = timingSafeEqual(paddedCandidate, paddedExpected);
  return candidateBuffer.length === expectedBuffer.length && matches;
}

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIp(request.headers);
    const rateLimit = checkRateLimit(`login:${ipAddress}`, {
      limit: 7,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Please wait and try again.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password.slice(0, 256) : '';

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const adminPasscode = process.env.ADMIN_PASSCODE;
    const salesPasscode = process.env.SALES_PASSCODE;

    let role: UserRole | null = null;

    if (matchesPasscode(password, adminPasscode)) {
      role = 'admin';
    } else if (matchesPasscode(password, salesPasscode)) {
      role = 'sales';
    }

    if (role) {
      const token = await createSessionToken(role);
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_DURATION_SECONDS,
        path: '/',
        priority: 'high',
      });
      cookieStore.delete('user_role');

      return NextResponse.json({ 
        success: true, 
        role,
        message: `Logged in as ${role === 'admin' ? 'Admin' : 'Sales'}`,
      });
    }

    // Invalid passcode
    return NextResponse.json(
      { error: 'Invalid passcode' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Unable to sign in right now.' },
      { status: 500 }
    );
  }
}
