import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex">
            <Link href="/" className="flex items-center text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Oxour <span className="text-blue-400">Holiday</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#packages" className="text-white hover:text-blue-300 transition-colors font-medium">
              Destinations
            </Link>
            <Link href="/#about" className="text-white hover:text-blue-300 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-300 transition-colors font-medium">
              Contact
            </Link>
            <Link
              href="#contact"
              className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
