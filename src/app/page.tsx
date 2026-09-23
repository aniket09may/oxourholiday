/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

const assurances = [
  { value: '100%', label: 'Tailor-made trips', icon: 'compass' },
  { value: '24/7', label: 'On-trip assistance', icon: 'clock' },
  { value: 'Clear', label: 'No-surprise pricing', icon: 'tag' },
];

function AssuranceIcon({ type }: { type: string }) {
  if (type === 'compass') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m14.9 9.1-1.7 4.1-4.1 1.7 1.7-4.1 4.1-1.7Z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'clock') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
      <path d="M4.5 11.2V5.5a1 1 0 0 1 1-1h5.7a2 2 0 0 1 1.4.6l6.8 6.8a1.5 1.5 0 0 1 0 2.1L14 19.4a1.5 1.5 0 0 1-2.1 0l-6.8-6.8a2 2 0 0 1-.6-1.4Z" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1" />
    </svg>
  );
}

const reasons = [
  {
    number: '01',
    title: 'Designed around you',
    copy: 'Tell us your pace, priorities, and budget. We shape the route instead of forcing you into a template.',
  },
  {
    number: '02',
    title: 'Ground support that answers',
    copy: 'From visa questions to airport pickups, a real travel expert stays close before and during your holiday.',
  },
  {
    number: '03',
    title: 'Costs you can understand',
    copy: 'Transparent inclusions, practical advice, and honest seasonal pricing—before you make a decision.',
  },
];

export default async function Home() {
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });

  if (error) {
    console.error('Unable to load public packages:', error);
  }

  const destinations = packages?.map((pkg) => pkg.title) || [];

  return (
    <main className="overflow-hidden bg-[#fffdf9]">
      <section className="relative min-h-[92vh] overflow-hidden bg-slate-950 pt-18 text-white">
        <img
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2200&q=88"
          alt="Long-tail boat approaching a tropical Thai island"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="hero-background-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2200&q=88"
          aria-hidden="true"
        >
          <source src="/videos/home-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,15,24,.94)_0%,rgba(3,22,33,.82)_38%,rgba(3,21,31,.54)_72%,rgba(2,16,25,.30)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,20,.18)_0%,transparent_48%,rgba(2,14,22,.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_18%,rgba(215,173,103,.18),transparent_27%)]" />
        <div className="floating-orb absolute -right-24 top-32 h-72 w-72 rounded-full border border-white/10 bg-teal-300/10 blur-2xl" />

        <div className="relative mx-auto grid min-h-[calc(92vh-4.5rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.75fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#e9d5ac]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7ad67] shadow-[0_0_14px_rgba(215,173,103,.75)]" />
              Southeast Asia, thoughtfully curated
            </div>
            <h1 className="animate-fade-up animation-delay-150 text-balance text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              Your next great story starts <span className="italic font-medium text-[#e3c382]">somewhere beautiful.</span>
            </h1>
            <p className="animate-fade-up animation-delay-300 mt-7 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
              Personalised escapes across Thailand, Vietnam, Bali, Singapore, and Malaysia—planned with local insight, transparent pricing, and real human support.
            </p>
            <div className="animate-fade-up animation-delay-450 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="#packages" className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-white transition hover:text-[#e9d5ac]">
                Explore journeys <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="#quote" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/[.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[.12]">
                Build a custom trip
              </Link>
            </div>

            <div className="animate-fade-up animation-delay-450 mt-12 grid max-w-2xl grid-cols-3 gap-2 border-t border-white/15 pt-7 sm:gap-5">
              {assurances.map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <span className="mb-3 grid h-9 w-9 place-items-center rounded-full border border-[#e3c382]/30 text-[#e3c382]">
                    <AssuranceIcon type={item.icon} />
                  </span>
                  <p className="text-lg font-bold text-white sm:text-xl">{item.value}</p>
                  <p className="mt-1 text-[9px] uppercase leading-4 tracking-[0.12em] text-white/55 sm:text-[11px]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="quote" className="glass-panel animate-fade-up animation-delay-300 scroll-mt-28 rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e3c382]">Complimentary trip plan</p>
                <h2 className="text-3xl text-white">Where would you like to go?</h2>
              </div>
            </div>
            <LeadForm destinations={destinations} />
          </div>
        </div>
      </section>

      <section id="packages" className="premium-page scroll-mt-24 px-6 py-24 sm:py-28">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Handpicked journeys</p>
              <h2 className="text-balance text-4xl text-slate-950 sm:text-5xl">Beautiful places. Better ways to experience them.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">Choose a starting point and we will tailor the pace, stays, and experiences around the way you love to travel.</p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-[#d7ad67]/30 bg-[#f5ead3] p-8 text-center text-[#533c20]">
              <h3 className="text-xl">Our journeys are being refreshed.</h3>
              <p className="mt-2 text-sm text-[#76552b]">Please send us your dream destination and our team will build a custom plan.</p>
              <Link href="#quote" className="accent-button mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">Request a custom trip</Link>
            </div>
          ) : packages && packages.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <article key={pkg.id} className="premium-card card-lift group overflow-hidden rounded-[1.75rem]">
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <img src={pkg.image_url} alt={pkg.title || 'Holiday destination'} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/88 px-3 py-1.5 text-xs font-bold text-slate-900 backdrop-blur">{pkg.duration}</div>
                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Starts from</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">₹{pkg.price?.toLocaleString('en-IN')}</span>
                        {pkg.regular_price && <del className="text-sm text-white/55">₹{pkg.regular_price.toLocaleString('en-IN')}</del>}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl text-slate-950">{pkg.title}</h3>
                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{pkg.description}</p>
                    <Link href={`/destinations/${pkg.slug}`} className="mt-6 flex items-center justify-between border-t border-[#15232b]/8 pt-5 text-sm font-bold text-[#7d5727] transition group-hover:text-[#a77835]">
                      View full itinerary <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d7ad67]/14 transition group-hover:translate-x-1 group-hover:bg-[#d7ad67]/24">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#d7ad67]/45 bg-[#fffdf9]/75 p-12 text-center">
              <h3 className="text-2xl text-slate-900">A journey made only for you</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Tell us where you want to go and we will create a personal itinerary from scratch.</p>
              <Link href="#quote" className="accent-button mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">Start planning</Link>
            </div>
          )}
        </div>
      </section>

      <section id="why-us" className="relative scroll-mt-24 overflow-hidden bg-[#061b26] px-6 py-24 text-white sm:py-28">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#d7ad67]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d7ad67]">Why travel with Oxour</p>
              <h2 className="text-balance text-4xl sm:text-5xl">A holiday should feel effortless long before take-off.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/60">Thoughtful planning is invisible. It is the right hotel, a sensible transfer, and help exactly when you need it.</p>
            </div>
            <div className="grid gap-4">
              {reasons.map((reason) => (
                <div key={reason.number} className="group grid gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-6 transition hover:border-[#d7ad67]/35 hover:bg-white/[.075] sm:grid-cols-[70px_1fr]">
                  <span className="text-sm font-bold tracking-[0.18em] text-[#d7ad67]">{reason.number}</span>
                  <div>
                    <h3 className="text-2xl">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/58">{reason.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
