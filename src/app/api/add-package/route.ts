import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { authorize } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validatePackageInput } from '@/lib/validation';

export async function POST(request: Request) {
  const session = await authorize(['admin']);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = validatePackageInput(body);

    if ('error' in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('packages')
      .insert({ ...validated.data, is_active: true })
      .select()
      .single();

    if (error) {
      console.error('Failed to add package:', error);
      return NextResponse.json({ error: 'Failed to add package.' }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Add package API error:', error);
    return NextResponse.json({ error: 'Unable to add package.' }, { status: 500 });
  }
}
