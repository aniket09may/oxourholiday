import { supabase } from '@/lib/supabase';
import PackageToggle from '@/components/PackageToggle';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import AddPackageForm from '@/components/AddPackageForm';

export const revalidate = 0; // Don't cache this page
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch all packages (including inactive ones)
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Package Management
          </h1>
          <p className="text-slate-600">
            Manage your tour packages and control their visibility on the website
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Packages</p>
                <p className="text-3xl font-bold text-slate-900">{packages?.length || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Active Packages</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {packages?.filter(pkg => pkg.is_active).length || 0}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Inactive Packages</p>
                <p className="text-3xl font-bold text-slate-400">
                  {packages?.filter(pkg => !pkg.is_active).length || 0}
                </p>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Package Form */}
        <AddPackageForm />

        {/* Packages Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {packages && packages.length > 0 ? (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={pkg.image_url} 
                            alt={pkg.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{pkg.title}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{pkg.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {pkg.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {pkg.regular_price && (
                            <del className="text-gray-400 text-xs block">₹{pkg.regular_price?.toLocaleString('en-IN')}</del>
                          )}
                          <p className="font-semibold text-slate-900">₹{pkg.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {pkg.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {pkg.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1.5"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <PackageToggle 
                            packageId={pkg.id} 
                            initialStatus={pkg.is_active} 
                          />
                          <Link 
                            href={`/destinations/${pkg.slug}`}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            target="_blank"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No packages found. Add packages to your Supabase database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlights Preview */}
        {packages && packages.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Package Highlights Preview
            </h2>
            <div className="space-y-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-slate-900 mb-3">{pkg.title}</h3>
                  {pkg.highlights && pkg.highlights.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pkg.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No highlights added for this package</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
