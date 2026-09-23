"use client";

import { useState } from "react";

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
      const response = await fetch('/api/toggle-package', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: packageId, isActive: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update package status');
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
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`${isActive ? 'Deactivate' : 'Activate'} package`}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#d7ad67] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-[#b48743]' : 'bg-slate-300'
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
