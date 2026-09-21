"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface PackageToggleProps {
  packageId: string;
  initialStatus: boolean;
}

export default function PackageToggle({ packageId, initialStatus }: PackageToggleProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = !isActive;
      const { error } = await supabase
        .from('packages')
        .update({ is_active: newStatus })
        .eq('id', packageId);

      if (error) {
        throw error;
      }

      setIsActive(newStatus);
    } catch (error) {
      console.error('Error updating package status:', error);
      alert('Failed to update package status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-emerald-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
