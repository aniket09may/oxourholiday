"use client";

import { useState } from 'react';

export default function AddPackageForm() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    regular_price: '',
    duration: '',
    image_url: '',
    highlights: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/add-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add package');
      }

      setMessage({ type: 'success', text: 'Package added successfully!' });
      // Reset form
      setFormData({
        title: '',
        slug: '',
        price: '',
        regular_price: '',
        duration: '',
        image_url: '',
        highlights: '',
        description: '',
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to add package' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Add New Package
        </h2>
        <p className="text-slate-600 text-sm">
          Create a new tour package that will appear on the website immediately after saving.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              Package Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Magical Thailand Tour"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-slate-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
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
            <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
              Starting Price (₹) *
            </label>
            <input
              type="text"
              id="price"
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
            <label htmlFor="regular_price" className="block text-sm font-semibold text-slate-700 mb-2">
              Regular Price (₹)
            </label>
            <input
              type="text"
              id="regular_price"
              value={formData.regular_price}
              onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
              placeholder="e.g., 55999"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
            <p className="text-xs text-slate-500 mt-1">Optional: Original price for strikethrough display</p>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-semibold text-slate-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              id="duration"
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
          <label htmlFor="image_url" className="block text-sm font-semibold text-slate-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            id="image_url"
            required
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="e.g., https://images.unsplash.com/photo-..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">Paste a direct image URL (preferably from Unsplash or your image host)</p>
        </div>

        {/* Highlights */}
        <div>
          <label htmlFor="highlights" className="block text-sm font-semibold text-slate-700 mb-2">
            Package Highlights *
          </label>
          <input
            type="text"
            id="highlights"
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
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
            Package Description *
          </label>
          <textarea
            id="description"
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
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Package
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
