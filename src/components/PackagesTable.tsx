"use client";

import { useState } from 'react';
import Link from 'next/link';
import PackageToggle from '@/components/PackageToggle';
import EditPackageModal from '@/components/EditPackageModal';

interface Package {
  id: string;
  title: string;
  slug: string;
  price: number;
  regular_price?: number | null;
  duration: string;
  image_url: string;
  highlights: string[];
  description: string;
  is_active: boolean;
}

interface PackagesTableProps {
  packages: Package[];
}

export default function PackagesTable({ packages }: PackagesTableProps) {
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay before clearing to allow modal close animation
    setTimeout(() => setEditingPackage(null), 300);
  };

  return (
    <>
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
                        <button
                          onClick={() => handleEditClick(pkg)}
                          className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <Link 
                          href={`/destinations/${pkg.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          target="_blank"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
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

      {/* Edit Modal */}
      {editingPackage && (
        <EditPackageModal
          package={editingPackage}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
