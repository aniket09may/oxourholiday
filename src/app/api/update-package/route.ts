import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, slug, price, regular_price, duration, image_url, highlights, description } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    if (!title || !slug || !price || !duration || !image_url || !highlights || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Parse highlights from comma-separated string to array
    const highlightsArray = typeof highlights === 'string'
      ? highlights
          .split(',')
          .map((h: string) => h.trim())
          .filter((h: string) => h.length > 0)
      : highlights;

    // Parse price to number
    const priceNumber = typeof price === 'string' 
      ? parseInt(price.replace(/[^0-9]/g, ''), 10)
      : price;
    
    if (isNaN(priceNumber)) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    // Parse regular_price to number (optional field)
    let regularPriceNumber = null;
    if (regular_price && regular_price !== '') {
      regularPriceNumber = typeof regular_price === 'string'
        ? parseInt(regular_price.replace(/[^0-9]/g, ''), 10)
        : regular_price;
      
      if (isNaN(regularPriceNumber)) {
        return NextResponse.json(
          { error: 'Invalid regular price format' },
          { status: 400 }
        );
      }
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('packages')
      .update({
        title,
        slug,
        price: priceNumber,
        regular_price: regularPriceNumber,
        duration,
        image_url,
        highlights: highlightsArray,
        description,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update package' },
        { status: 500 }
      );
    }

    // Revalidate paths to show the updated package immediately
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/destinations/${slug}`);

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
