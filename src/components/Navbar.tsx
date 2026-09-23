'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/#packages', label: 'Destinations' },
  { href: '/#why-us', label: 'Why Oxour' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/82 text-white shadow-[0_8px_30px_rgba(2,12,27,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-300/50 bg-amber-300/10 text-sm font-bold text-amber-200 transition group-hover:rotate-6 group-hover:bg-amber-300/20">O</span>
          <span className="text-xl font-bold tracking-tight sm:text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>
            Oxour <span className="text-amber-300">Holiday</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/75 transition hover:text-white">{link.label}</Link>
          ))}
          <Link href="/#quote" className="rounded-full border border-[#d7ad67]/55 bg-white/[.04] px-5 py-2.5 text-sm font-semibold text-[#ead5aa] transition duration-300 hover:-translate-y-0.5 hover:border-[#d7ad67] hover:bg-white/[.09] hover:text-white">Plan my trip</Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
        >
          <span className="text-xl" aria-hidden="true">{isOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="animate-fade-in border-t border-white/10 bg-slate-950 px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white" onClick={() => setIsOpen(false)}>{link.label}</Link>
            ))}
            <Link href="/#quote" className="mt-2 rounded-xl border border-[#d7ad67]/55 bg-white/[.04] px-4 py-3 text-center text-sm font-semibold text-[#ead5aa]" onClick={() => setIsOpen(false)}>Plan my trip</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
