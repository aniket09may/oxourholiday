"use client";

import { useState } from "react";
import { submitLead } from "@/actions/submitLead";
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";

interface LeadFormProps {
  destinations?: string[];
}

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)", country: "IN" },
  { code: "+1", label: "USA/Canada (+1)", country: "US" },
  { code: "+44", label: "UK (+44)", country: "GB" },
  { code: "+971", label: "UAE (+971)", country: "AE" },
  { code: "+61", label: "Australia (+61)", country: "AU" },
  { code: "+64", label: "New Zealand (+64)", country: "NZ" },
  { code: "+65", label: "Singapore (+65)", country: "SG" },
  { code: "+66", label: "Thailand (+66)", country: "TH" },
  { code: "+62", label: "Indonesia (+62)", country: "ID" },
  { code: "+84", label: "Vietnam (+84)", country: "VN" },
  { code: "+60", label: "Malaysia (+60)", country: "MY" },
  { code: "+63", label: "Philippines (+63)", country: "PH" },
];

export default function LeadForm({ destinations = [] }: LeadFormProps) {
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      destination: destinations.length > 0 ? destinations[0] : "custom",
    });
    const [countryCode, setCountryCode] = useState("+91");
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>("IN");
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

                                const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

        try {
      // Validate phone number using libphonenumber-js
      const phoneValue = formData.phone;
      
      if (!isValidPhoneNumber(phoneValue, selectedCountry as CountryCode)) {
        setError("Please enter a valid mobile number for the selected country.");
        setIsSubmitting(false);
        return;
      }
      
      // Strip non-numeric characters for DB and WhatsApp API
      const cleanPhone = phoneValue.replace(/[^0-9]/g, "");
      const fullWhatsApp = countryCode.replace('+', '') + cleanPhone;

      // Submit lead (Supabase insert + Resend email notification)
      const result = await submitLead({
        name: formData.name,
        phone: fullWhatsApp,
        destination: formData.destination,
      });

            if (!result.success) {
        throw new Error(result.error || "Failed to submit lead");
      }

      // Reset form after successful submission
      setFormData({ name: "", phone: "", destination: destinations.length > 0 ? destinations[0] : "custom" });
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
        <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
          Your Full Name
        </label>
        <input 
          type="text" 
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Rahul Patil" 
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
        />
      </div>

            <div>
        <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
          WhatsApp Mobile Number
        </label>
        <div className="flex gap-2">
                                        <select
                      value={countryCode}
                                            onChange={(e) => {
                        const selected = COUNTRY_CODES.find(c => c.code === e.target.value);
                        setCountryCode(e.target.value);
                        setSelectedCountry((selected?.country || "IN") as CountryCode);
                      }}
                      className="w-[140px] shrink-0 px-3 py-3 rounded-lg border border-white/30 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                    >
            {COUNTRY_CODES.map((country) => (
              <option key={country.country} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
                    <input 
            type="tel" 
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 98765 43210 or +91 98765 43210" 
            className="flex-1 w-full px-4 py-3 rounded-lg border border-white/30 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
          Destination of Interest
        </label>
                <select 
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        >
          {destinations.length > 0 ? (
            destinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))
          ) : (
            <>
              <option value="thailand">Thailand</option>
              <option value="bali">Bali</option>
              <option value="vietnam">Vietnam</option>
              <option value="singapore">Singapore</option>
              <option value="malaysia">Malaysia</option>
            </>
          )}
          <option value="custom">Custom Itinerary</option>
        </select>
      </div>

                        {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Thank you! We've received your inquiry and will contact you soon.
        </div>
      )}

            <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3.5 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Get Free Quote"}
      </button>
    </form>
  );
}