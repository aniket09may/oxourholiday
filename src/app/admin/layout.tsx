import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const userRole = session.role;

  return (
    <div className="admin-shell min-h-screen pt-18">
      {/* Admin Header/Navigation */}
      <header className="sticky top-18 z-40 border-b border-[#d7ad67]/20 bg-[#fffdf9]/90 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <h1 
                  className="text-2xl font-bold text-slate-900" 
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Oxour <span className="text-[#a77835]">Holiday</span>
                </h1>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Show "Manage Packages" only for admin role */}
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#d7ad67]/10 hover:text-[#7d5727]"
                  >
                    📦 Manage Packages
                  </Link>
                )}
                
                {/* Show "View Leads" for both admin and sales */}
                <Link
                  href="/admin/leads"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#d7ad67]/10 hover:text-[#7d5727]"
                >
                  👥 View Leads
                </Link>
              </nav>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-[#d7ad67]/20 bg-[#d7ad67]/10 px-3 py-1.5 sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#b0823e]"></span>
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {userRole}
                </span>
              </div>
              
              <LogoutButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 pb-3 border-t border-slate-100 pt-3 -mx-2">
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-[#d7ad67]/10 hover:text-[#7d5727]"
              >
                📦 Packages
              </Link>
            )}
            
            <Link
              href="/admin/leads"
              className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-[#d7ad67]/10 hover:text-[#7d5727]"
            >
              👥 Leads
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
