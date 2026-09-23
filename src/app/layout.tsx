
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Oxour Holiday | Curated Southeast Asian Escapes",
    template: "%s | Oxour Holiday",
  },
  description: "Premium international tour packages to Thailand, Vietnam, Bali, and Malaysia. Transparent pricing, full visa assistance, and 24/7 support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        
        <footer className="mt-auto border-t border-white/10 bg-slate-950 py-14 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-300/40 bg-amber-300/10 text-sm font-bold text-amber-200">O</span>
                  <h3 className="text-2xl font-bold">Oxour Holiday</h3>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-slate-400">
                  Your trusted partner for unforgettable Southeast Asian adventures. We deliver premium experiences with transparency and care.
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Contact</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>+91 98765 43210</p>
                  <p>+91 87654 32109</p>
                  <p>hello@oxourholiday.com</p>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Our office</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  123 MG Road, Connaught Place<br />
                  New Delhi, Delhi 110001<br />
                  India
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
              <span>© {new Date().getFullYear()} Oxour Holiday. All rights reserved.</span>
              <span>Travel thoughtfully. Explore beautifully.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
