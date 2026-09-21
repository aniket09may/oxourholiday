import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user_role')?.value;

  // If no role (shouldn't happen due to middleware, but as a fallback)
  if (!userRole) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header/Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <h1 
                  className="text-2xl font-bold text-slate-900" 
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Oxour Holiday
                </h1>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Show "Manage Packages" only for admin role */}
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    📦 Manage Packages
                  </Link>
                )}
                
                {/* Show "View Leads" for both admin and sales */}
                <Link
                  href="/admin/leads"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  👥 View Leads
                </Link>
              </nav>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
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
                className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-center"
              >
                📦 Packages
              </Link>
            )}
            
            <Link
              href="/admin/leads"
              className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-center"
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
