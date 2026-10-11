
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
  title: "Oxour Holiday - Curated Southeast Asian Escapes",
  description: "Premium international tour packages to Thailand, Vietnam, Bali, and Malaysia. Transparent pricing, full visa assistance, and 24/7 support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-inter)' }}>
        <Navbar />
        {children}
        
        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Brand Column */}
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Oxour Holiday
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your trusted partner for unforgettable Southeast Asian adventures. We deliver premium experiences with transparency and care.
                </p>
              </div>

              {/* Contact Column */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>📞 <a href="tel:+919112787979" className="hover:text-white transition-colors">+91 91127 87979</a></p>
                  <p>📞 <a href="tel:+919130585959" className="hover:text-white transition-colors">+91 91305 85959</a></p>
                  <p>✉️ <a href="mailto:sales@oxourholiday.com" className="hover:text-white transition-colors">sales@oxourholiday.com</a></p>
                </div>
              </div>

              {/* Location Column */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Our Location</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Oxour Holiday<br />
                  Shop No.7 United Apartments, East Street, MG Road Camp<br />
                  Pune 411001<br />
                  India
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} Oxour Holiday. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
