import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const adminPasscode = process.env.ADMIN_PASSCODE;
    const salesPasscode = process.env.SALES_PASSCODE;

    // Check against Admin passcode
    if (password === adminPasscode) {
      const cookieStore = await cookies();
      cookieStore.set('user_role', 'admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ 
        success: true, 
        role: 'admin',
        message: 'Logged in as Admin' 
      });
    }

    // Check against Sales passcode
    if (password === salesPasscode) {
      const cookieStore = await cookies();
      cookieStore.set('user_role', 'sales', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ 
        success: true, 
        role: 'sales',
        message: 'Logged in as Sales' 
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
