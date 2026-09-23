import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete('user_role');

    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
