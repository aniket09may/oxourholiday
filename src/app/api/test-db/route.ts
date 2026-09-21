import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Database Connection Test Endpoint
 * Access at: http://localhost:3000/api/test-db
 * 
 * This endpoint helps verify:
 * 1. Supabase connection is working
 * 2. Environment variables are set
 * 3. Packages table exists and has data
 */
export async function GET() {
  try {
    // Test 1: Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          NEXT_PUBLIC_SUPABASE_URL: hasUrl ? '✅ Set' : '❌ Missing',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey ? '✅ Set' : '❌ Missing',
        },
        instructions: 'Create .env.local file with Supabase credentials'
      }, { status: 500 });
    }

    // Test 2: Fetch packages
    const { data: packages, error } = await supabase
      .from('packages')
      .select('id, title, slug, is_active, price, duration')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: error,
        possibleCauses: [
          'Table "packages" does not exist',
          'Row Level Security (RLS) is blocking access',
          'Invalid Supabase credentials',
          'Network/firewall issues'
        ]
      }, { status: 500 });
    }

    // Test 3: Check data quality
    const activePackages = packages?.filter(pkg => pkg.is_active) || [];
    const missingSlug = packages?.filter(pkg => !pkg.slug) || [];

    return NextResponse.json({
      success: true,
      message: '✅ Database connection successful!',
      stats: {
        totalPackages: packages?.length || 0,
        activePackages: activePackages.length,
        inactivePackages: (packages?.length || 0) - activePackages.length,
        packagesWithoutSlug: missingSlug.length
      },
      packages: packages?.map(pkg => ({
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug || '❌ MISSING',
        isActive: pkg.is_active,
        price: pkg.price,
        duration: pkg.duration
      })),
      warnings: missingSlug.length > 0 ? [
        `⚠️ ${missingSlug.length} package(s) missing slug values - cards won't be clickable`
      ] : [],
      recommendations: packages?.length === 0 ? [
        'Run: npx tsx src/scripts/seed-packages.ts',
        'Or add packages manually via Supabase Dashboard'
      ] : activePackages.length === 0 ? [
        'Set is_active = true for packages in Supabase'
      ] : []
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
