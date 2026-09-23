import Link from 'next/link';
import { supabase } from '@/lib/supabase';
/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import LeadForm from '@/components/LeadForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the specific package from Supabase
  const { data: pkg, error } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !pkg) {
    notFound();
  }

  // Fetch all active packages for the dropdown
  const { data: allPackages } = await supabase
    .from('packages')
    .select('title')
    .eq('is_active', true)
    .order('title', { ascending: true });

  return (
    <main className="flex min-h-screen flex-col bg-white pt-18">
      {/* Hero Section with Package Image */}
      <section className="relative w-full h-[60vh] bg-slate-950">
        <img 
          src={pkg.image_url} 
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
              {pkg.duration}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              {pkg.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {pkg.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Price and Overview */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                  <div>
                    <span className="text-sm text-slate-500 block mb-2">Starting from</span>
                    {pkg.regular_price && (
                      <del className="text-gray-400 text-sm block mb-1">₹{pkg.regular_price?.toLocaleString('en-IN')}</del>
                    )}
                    <div>
                      <span className="text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                        ₹{pkg.price?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-500 ml-2">per person</span>
                    </div>
                  </div>
                  <a 
                    href="#booking" 
                    className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition text-center"
                  >
                    Book Now
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-300">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                    <p className="font-semibold text-slate-900">{pkg.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Accommodation</p>
                    <p className="font-semibold text-slate-900">4★ Hotels</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Meals</p>
                    <p className="font-semibold text-slate-900">Breakfast</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Transfers</p>
                    <p className="font-semibold text-slate-900">Included</p>
                  </div>
                </div>
              </div>

              {/* Package Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Package Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                        <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-slate-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Description */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                  About This Tour
                </h2>
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                  <p>{pkg.description}</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">Airport transfers & local transportation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">4-star hotel accommodation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">Daily breakfast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">Visa assistance & documentation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">24/7 travel support</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                    What&apos;s Not Included
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-700">International airfare</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-700">Travel insurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-700">Personal expenses & shopping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-700">Lunch & dinner (unless specified)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-slate-900 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Get Custom Quote
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Receive personalized itinerary and pricing on WhatsApp
                </p>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                  <LeadForm destinations={allPackages?.map(p => p.title) || []} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Packages */}
      <section className="py-12 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <Link 
            href="/#packages"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Packages
          </Link>
        </div>
      </section>
    </main>
  );
}

// Generate static params for all active packages
export async function generateStaticParams() {
  const { data: packages } = await supabase
    .from('packages')
    .select('slug')
    .eq('is_active', true);

  return packages?.map((pkg) => ({
    slug: pkg.slug,
  })) || [];
}
