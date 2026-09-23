'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LeadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || '';

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="premium-card mb-6 rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name or phone..."
              defaultValue={currentSearch}
              onChange={(e) => updateURL('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <label htmlFor="status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status
          </label>
          <select
            id="status"
            defaultValue={currentStatus}
            onChange={(e) => updateURL('status', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(currentSearch || currentStatus) && (
          <div className="sm:w-auto flex items-end">
            <button
              onClick={() => {
                startTransition(() => {
                  router.push('/admin/leads', { scroll: false });
                });
              }}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        )}
      </div>
      
      {/* Loading Indicator */}
      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Applying filters...</span>
        </div>
      )}
    </div>
  );
}
