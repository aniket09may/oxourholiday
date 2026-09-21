import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, price, regular_price, duration, image_url, highlights, description } = body;

    // Validate required fields
    if (!title || !slug || !price || !duration || !image_url || !highlights || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Parse highlights from comma-separated string to array
    const highlightsArray = highlights
      .split(',')
      .map((h: string) => h.trim())
      .filter((h: string) => h.length > 0);

    // Parse price to number
    const priceNumber = parseInt(price.replace(/[^0-9]/g, ''), 10);
    
    if (isNaN(priceNumber)) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    // Parse regular_price to number (optional field)
    let regularPriceNumber = null;
    if (regular_price && regular_price.trim() !== '') {
      regularPriceNumber = parseInt(regular_price.replace(/[^0-9]/g, ''), 10);
      if (isNaN(regularPriceNumber)) {
        return NextResponse.json(
          { error: 'Invalid regular price format' },
          { status: 400 }
        );
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('packages')
      .insert({
        title,
        slug,
        price: priceNumber,
        regular_price: regularPriceNumber,
        duration,
        image_url,
        highlights: highlightsArray,
        description,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to insert package' },
        { status: 500 }
      );
    }

    // Revalidate paths to show the new package immediately
    revalidatePath('/');
    revalidatePath('/admin');

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
