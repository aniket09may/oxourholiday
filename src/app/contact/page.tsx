import LeadForm from "@/components/LeadForm";

export default function ContactPage() {
  return (
    <main className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ready to start your journey? Reach out to us and let&apos;s plan your perfect Southeast Asian escape.
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            {/* Office Address */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                📍 Our Office
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Oxour Holiday<br />
                Shop No.7 United Apartments, East Street, MG Road Camp<br />
                Pune 411001<br />
                India
              </p>
            </div>

            {/* Operating Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                🕒 Operating Hours
              </h2>
              <div className="space-y-2 text-slate-700">
                <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 7:00 PM</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 5:00 PM</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                📞 Direct Lines
              </h2>
              <div className="space-y-3 text-slate-700">
                <div>
                  <p className="font-medium text-sm text-slate-500 uppercase tracking-wide">Customer Support</p>
                  <a href="tel:+919112787979" className="text-lg hover:text-blue-600 transition-colors">+91 91127 87979</a>
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-500 uppercase tracking-wide">Sales Inquiries</p>
                  <a href="tel:+919130585959" className="text-lg hover:text-blue-600 transition-colors">+91 91305 85959</a>
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-500 uppercase tracking-wide">Email</p>
                  <a href="mailto:sales@oxourholiday.com" className="text-lg hover:text-blue-600 transition-colors">sales@oxourholiday.com</a>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-2xl bg-slate-100 h-64 flex items-center justify-center border border-slate-200">
              <div className="text-center text-slate-500">
                <svg 
                  className="w-12 h-12 mx-auto mb-3 text-slate-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <p className="text-sm font-medium">Google Maps Embed</p>
                <p className="text-xs mt-1">(Placeholder)</p>
              </div>
            </div>
          </div>

          {/* Right Side - Lead Form */}
          <div id="enquiry" className="scroll-mt-24 sticky top-24">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Send Us a Message
              </h2>
              <p className="text-blue-100 mb-6 text-sm">
                Fill out the form below and we&apos;ll connect with you on WhatsApp instantly.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
