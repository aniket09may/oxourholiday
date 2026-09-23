"use client";

import { useEffect, useRef, useState } from "react";
import { submitLead } from "@/actions/submitLead";
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

interface LeadFormProps {
  destinations?: string[];
}

const COUNTRIES: Array<{ label: string; country: CountryCode; dialCode: string }> = [
  { dialCode: "+91", label: "India", country: "IN" },
  { dialCode: "+1", label: "USA / Canada", country: "US" },
  { dialCode: "+44", label: "United Kingdom", country: "GB" },
  { dialCode: "+971", label: "UAE", country: "AE" },
  { dialCode: "+61", label: "Australia", country: "AU" },
  { dialCode: "+64", label: "New Zealand", country: "NZ" },
  { dialCode: "+65", label: "Singapore", country: "SG" },
  { dialCode: "+66", label: "Thailand", country: "TH" },
  { dialCode: "+62", label: "Indonesia", country: "ID" },
  { dialCode: "+84", label: "Vietnam", country: "VN" },
  { dialCode: "+60", label: "Malaysia", country: "MY" },
  { dialCode: "+63", label: "Philippines", country: "PH" },
];

export default function LeadForm({ destinations = [] }: LeadFormProps) {
  const initialDestination = destinations[0] || "thailand";
  const startedAt = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: initialDestination,
  });
  const [country, setCountry] = useState<CountryCode>("IN");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const rawPhone = formData.phone.trim();
      const parsedPhone = rawPhone.startsWith("+")
        ? parsePhoneNumberFromString(rawPhone)
        : parsePhoneNumberFromString(rawPhone, country);

      if (!parsedPhone?.isValid()) {
        setError("Please enter a valid mobile number for the selected country.");
        return;
      }

      const result = await submitLead({
        name: formData.name,
        phone: parsedPhone.number.replace("+", ""),
        destination: formData.destination,
        website,
        startedAt: startedAt.current,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit lead");
      }

      setFormData({ name: "", phone: "", destination: initialDestination });
      setWebsite("");
      startedAt.current = Date.now();
      setSuccess(true);
    } catch (submissionError) {
      console.error("Error submitting lead:", submissionError);
      setError(submissionError instanceof Error ? submissionError.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="lead-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
          Your full name
        </label>
        <input
          id="lead-name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          placeholder="e.g. Rahul Patil"
          className="field-control"
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
          WhatsApp mobile number
        </label>
        <div className="grid grid-cols-[132px_1fr] gap-2">
          <select
            aria-label="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value as CountryCode)}
            className="field-control px-3"
          >
            {COUNTRIES.map((item) => (
              <option key={item.country} value={item.country}>
                {item.dialCode} {item.label}
              </option>
            ))}
          </select>
          <input
            id="lead-phone"
            type="tel"
            required
            maxLength={24}
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            placeholder="98765 43210"
            className="field-control min-w-0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-destination" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
          Destination of interest
        </label>
        <select
          id="lead-destination"
          value={formData.destination}
          onChange={(event) => setFormData({ ...formData, destination: event.target.value })}
          className="field-control"
        >
          {destinations.length > 0 ? (
            destinations.map((destination) => (
              <option key={destination} value={destination}>{destination}</option>
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
          <option value="custom">Custom itinerary</option>
        </select>
      </div>

      <div aria-live="polite">
        {error && (
          <div className="flex gap-2 rounded-xl border border-red-200/70 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span aria-hidden="true">!</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>Thank you. Your travel expert will contact you shortly.</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#d7ad67] px-6 py-3.5 text-sm font-bold text-[#15232b] shadow-[0_14px_34px_rgba(13,20,24,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e5c582] hover:shadow-[0_18px_42px_rgba(13,20,24,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            Securing your request…
          </>
        ) : (
          <>
            Plan my holiday
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </>
        )}
      </button>

      <div className="space-y-1 text-center text-[11px] leading-relaxed">
        <p className="font-semibold text-[#ead5aa]">⚡ We typically reply within 15 minutes</p>
        <p className="text-white/52">No spam. Your details are used only to plan your trip.</p>
      </div>
    </form>
  );
}
