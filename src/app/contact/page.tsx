import LeadForm from '@/components/LeadForm';

const contactItems = [
  { label: 'Customer support', value: '+91 98765 43210', detail: 'Trip support and general questions' },
  { label: 'Sales inquiries', value: '+91 87654 32109', detail: 'New itineraries and quotations' },
  { label: 'Email', value: 'hello@oxourholiday.com', detail: 'We normally reply the same business day' },
];

export default function ContactPage() {
  return (
    <main className="premium-page min-h-screen pt-18">
      <section className="relative overflow-hidden bg-[#061b26] px-6 py-20 text-white sm:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#d7ad67]/12 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="animate-fade-up mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d7ad67]">Talk to a travel expert</p>
          <h1 className="animate-fade-up animation-delay-150 max-w-4xl text-balance text-5xl leading-tight sm:text-6xl">Let&apos;s turn the trip in your head into a plan you can book.</h1>
          <p className="animate-fade-up animation-delay-300 mt-6 max-w-2xl text-base leading-8 text-white/65">Share the basics today. We will come back with thoughtful questions, practical advice, and a clear next step.</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-3">Reach us directly</p>
              <h2 className="text-4xl text-slate-950">Real people, ready to help.</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">Whether you have a destination in mind or only a few holiday dates, that is enough to begin.</p>
            </div>

            <div className="grid gap-4">
              {contactItems.map((item) => (
                <div key={item.label} className="premium-card card-lift rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a6f31]">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#d7ad67]/18 bg-[#efe5d3]/55 p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d7ad67]/25 bg-[#fffdf9] text-lg text-[#9a6f31] shadow-sm" aria-hidden="true">⌖</span>
                <div>
                  <h3 className="text-xl text-slate-950">Visit our office</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">123 MG Road, Connaught Place<br />New Delhi, Delhi 110001, India</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Monday–Friday, 9 AM–7 PM · Saturday, 10 AM–5 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel dark-glass-panel sticky top-26 rounded-[2rem] p-6 text-white sm:p-9">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d7ad67]">Your complimentary consultation</p>
            <h2 className="text-3xl">Tell us what would make this trip special.</h2>
            <p className="mb-7 mt-3 text-sm leading-6 text-white/60">We will review your request and follow up on WhatsApp with the right options.</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
