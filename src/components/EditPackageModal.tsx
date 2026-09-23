"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
}

interface EditPackageModalProps {
  package: Package;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPackageModal({ package: pkg, isOpen, onClose }: EditPackageModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: pkg.title || '',
    slug: pkg.slug || '',
    price: pkg.price?.toString() || '',
    regular_price: pkg.regular_price?.toString() || '',
    duration: pkg.duration || '',
    image_url: pkg.image_url || '',
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(', ') : '',
    description: pkg.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/update-package', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pkg.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update package');
      }

      setMessage({ type: 'success', text: 'Package updated successfully!' });
      
      // Refresh the page data
      router.refresh();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update package' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="premium-card relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d7ad67]/18 bg-[#fffdf9]/95 px-8 py-6 backdrop-blur-xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Edit Package
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Update the package details below
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Title */}
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-semibold text-slate-700 mb-2">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Magical Thailand Tour"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                  />
                </div>

                {/* URL Slug */}
                <div>
                  <label htmlFor="edit-slug" className="block text-sm font-semibold text-slate-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    id="edit-slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., thailand"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use lowercase letters and hyphens only (no spaces)</p>
                </div>

                {/* Starting Price */}
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-semibold text-slate-700 mb-2">
                    Starting Price (₹) *
                  </label>
                  <input
                    type="text"
                    id="edit-price"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 45999"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter the current sale/active price</p>
                </div>

                {/* Regular Price (Optional) */}
                <div>
                  <label htmlFor="edit-regular_price" className="block text-sm font-semibold text-slate-700 mb-2">
                    Regular Price (₹)
                  </label>
                  <input
                    type="text"
                    id="edit-regular_price"
                    value={formData.regular_price}
                    onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
                    placeholder="e.g., 55999"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">Optional: Original price for strikethrough display</p>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="edit-duration" className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="edit-duration"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 5N/6D"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="edit-image_url" className="block text-sm font-semibold text-slate-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="edit-image_url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="e.g., https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">Paste a direct image URL (preferably from Unsplash or your image host)</p>
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Image Preview</p>
                  <img 
                    src={formData.image_url} 
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Highlights */}
              <div>
                <label htmlFor="edit-highlights" className="block text-sm font-semibold text-slate-700 mb-2">
                  Package Highlights *
                </label>
                <input
                  type="text"
                  id="edit-highlights"
                  required
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="e.g., Visit Grand Palace, Phi Phi Island Tour, Bangkok Shopping Experience, Thai Massage Session"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">Separate each highlight with a comma</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-semibold text-slate-700 mb-2">
                  Package Description *
                </label>
                <textarea
                  id="edit-description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the package in detail..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 resize-none"
                />
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'success' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span>{message.text}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="accent-button flex items-center gap-2 rounded-full px-8 py-2.5 font-semibold disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
