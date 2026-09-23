import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import LeadTableBody from '@/components/LeadTableBody';
import LeadFilters from '@/components/LeadFilters';
import { authorize } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const revalidate = 0; // Don't cache this page
export const dynamic = 'force-dynamic';

// Server Action to update lead
async function updateLead(formData: FormData) {
  'use server';

  const session = await authorize(['admin', 'sales']);

  if (!session) {
    return { error: 'Unauthorized' };
  }
  
  const leadId = formData.get('leadId') as string;
  const field = formData.get('field') as string;
  const rawValue = formData.get('value');
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';
  const allowedFields = ['status', 'sales_rep', 'notes'] as const;

  if (!leadId || !allowedFields.includes(field as (typeof allowedFields)[number])) {
    return { error: 'Missing required fields' };
  }

  if (field === 'status' && !['new', 'contacted', 'won', 'lost'].includes(value)) {
    return { error: 'Invalid lead status' };
  }

  if ((field === 'sales_rep' && value.length > 100) || (field === 'notes' && value.length > 500)) {
    return { error: 'Value is too long' };
  }

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ [field]: value })
    .eq('id', leadId);

  if (error) {
    console.error('Error updating lead:', error);
    return { error: 'Unable to update the lead.' };
  }

  revalidatePath('/admin/leads');
  return { success: true };
}

interface LeadsPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const session = await authorize(['admin', 'sales']);

  if (!session) {
    redirect('/login');
  }

  // Get search params
  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || '';
  const statusFilter = params.status || '';

  // Fetch all leads from Supabase
  const { data: allLeads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
  }

  // Apply client-side filtering based on search params
  const leads = allLeads?.filter((lead) => {
    // Filter by search query (name or phone)
    if (searchQuery) {
      const matchesName = lead.name?.toLowerCase().includes(searchQuery);
      const matchesPhone = lead.phone?.toLowerCase().includes(searchQuery);
      if (!matchesName && !matchesPhone) {
        return false;
      }
    }

    // Filter by status
    if (statusFilter) {
      const leadStatus = lead.status?.toLowerCase();
      if (leadStatus !== statusFilter.toLowerCase()) {
        return false;
      }
    }

    return true;
  }) || [];

  // Group leads by status for stats (using filtered leads)
  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter((lead) => lead.status?.toLowerCase() === 'new').length || 0;
  const contactedLeads = leads?.filter((lead) => lead.status?.toLowerCase() === 'contacted').length || 0;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Leads Dashboard
          </h1>
          <p className="text-slate-600">
            View and manage all customer inquiries and leads
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="premium-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900">{totalLeads}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="premium-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">New Leads</p>
                <p className="text-3xl font-bold text-emerald-600">{newLeads}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="premium-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Contacted</p>
                <p className="text-3xl font-bold text-blue-600">{contactedLeads}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Filters */}
        <LeadFilters />

        {/* Leads Table */}
        <div className="premium-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Sales Rep
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <LeadTableBody leads={leads} updateLead={updateLead} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Export/Actions Section */}
        {leads && leads.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 rounded-full border border-[#d7ad67]/35 bg-[#fffdf9] px-4 py-2 text-sm font-medium text-[#76552b] transition-colors hover:bg-[#d7ad67]/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
