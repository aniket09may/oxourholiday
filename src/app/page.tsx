import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch all active packages from Supabase
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });
// Debug logging
  console.log('=== SUPABASE PACKAGES DEBUG ===');
  console.log('Packages count:', packages?.length || 0);
  console.log('Packages data:', JSON.stringify(packages, null, 2));
  console.log('Error:', error);
  
  if (error) {
    console.error('❌ Error fetching packages:', error);
  } else if (!packages || packages.length === 0) {
    console.warn('⚠️ No packages found in database');
  } else {
    console.log('✅ Successfully fetched', packages.length, 'packages');
    packages.forEach(pkg => {
      if (!pkg.slug) {
        console.warn('⚠️ Package missing slug:', pkg.id, pkg.title);
      }
    });
  }
  return (
    <main className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury travel destination"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Hero Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <div className="text-white">
              <span className="inline-block py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs md:text-sm font-semibold tracking-wider uppercase mb-6">
                India's Southeast Asia Specialist
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Curated Southeast Asian Escapes
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Handcrafted luxury tours to Thailand, Vietnam, Bali, and Malaysia. Transparent pricing, full visa assistance, and 24/7 dedicated support.
              </p>
              <a 
                href="#destinations" 
                className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition shadow-2xl"
              >
                Explore Destinations
              </a>
            </div>

            {/* Right: Lead Form in Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Get Your Custom Itinerary</h3>
              <p className="text-white/80 text-sm mb-6">Receive detailed itinerary PDFs and quotes within 15 minutes on WhatsApp.</p>
              <LeadForm destinations={packages?.map(p => p.title) || []} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS */}
      <section id="destinations" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Featured Tour Packages
          </h2>
          <p className="text-slate-600 text-lg">
            Fixed departures and customized itineraries with inclusive GST & TCS handling.
          </p>
        </div>

        {/* Debug Info - Remove in production */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">❌ Database Error:</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <p className="text-red-500 text-xs mt-2">Check your Supabase connection and environment variables.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.id} className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-white group">
                {/* Package Image */}
                <div className="relative h-80 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={pkg.image_url} 
                    alt={pkg.title || 'Package destination'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm text-white rounded-full shadow-xl">
                    <div className="flex flex-col items-end">
                      {pkg.regular_price && (
                        <del className="text-gray-400 text-sm">₹{pkg.regular_price?.toLocaleString('en-IN')}</del>
                      )}
                      <div>
                        <span className="text-xs font-medium">From</span>
                        <span className="text-xl font-bold ml-1">₹{pkg.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    {pkg.duration}
                  </div>
                </div>

                {/* Package Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {pkg.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Link 
                    href={`/destinations/${pkg.slug || ''}`} 
                    className="w-full text-center bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors"
                  >
                    View Full Itinerary
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-lg font-semibold text-slate-900 mb-2">No packages found</p>
                <p className="text-sm text-slate-600 mb-4">The packages table appears to be empty.</p>
                {!error && (
                  <div className="text-left bg-white p-4 rounded-lg border border-yellow-300 text-xs text-slate-700">
                    <p className="font-semibold mb-2">💡 To add packages:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to your Supabase dashboard</li>
                      <li>Navigate to Table Editor → packages</li>
                      <li>Add packages with: title, slug, description, price, duration, highlights, image_url, is_active=true</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. DIGITAL LEAD GENERATION */}
      <section id="contact" className="bg-slate-50 py-20 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-blue-600 text-sm font-bold tracking-wider uppercase mb-2 block">
            Direct WhatsApp Consultation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Plan Your Perfect Trip Over WhatsApp
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-10 text-base md:text-lg">
            No endless call center queues. Talk directly with our destination experts or receive complete PDF day-wise itineraries directly on WhatsApp.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/60 max-w-lg mx-auto text-left">
            <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Request Itinerary & Pricing</h3>
            <p className="text-slate-500 text-sm mb-6">Receive detailed itinerary PDFs and exact seasonal quotes within 15 minutes.</p>

            <LeadForm destinations={packages?.map(p => p.title) || []} />
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              GLOBAL<span className="text-blue-500">GATEWAY</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Registered Tour Operator • Servicing Pan-India
            </p>
          </div>
          <div className="text-xs text-slate-400">
            GST & TCS Compliant Invoicing • All outbound packages subject to Section 206C(1G) regulations.
          </div>
        </div>
      </footer>
    </main>
  );
}  