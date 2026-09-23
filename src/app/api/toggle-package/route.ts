import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(request: Request) {
  const session = await authorize(['admin']);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id.slice(0, 100) : '';
    const isActive = body.isActive;

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid package update.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('packages')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Failed to toggle package:', error);
      return NextResponse.json({ error: 'Failed to update package.' }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle package API error:', error);
    return NextResponse.json({ error: 'Unable to update package.' }, { status: 500 });
  }
}
