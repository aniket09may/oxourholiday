'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid passcode');
        return;
      }

      router.push(data.role === 'admin' ? '/admin' : '/admin/leads');
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#071b27] px-5 pb-16 pt-34 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,.17),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,.14),transparent_25%)]" />
      <div className="floating-orb absolute left-[8%] top-[22%] h-36 w-36 rounded-full border border-white/10 bg-white/5 blur-xl" />

      <div className="glass-panel animate-fade-up relative w-full max-w-md rounded-[2rem] p-7 sm:p-9">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-amber-300/40 bg-amber-300/10 font-bold text-amber-200">O</span>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Team access</p>
          <h1 className="text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-white/55">Sign in to manage leads and holiday packages.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Access code</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field-control"
              placeholder="Enter your secure passcode"
              autoComplete="current-password"
              maxLength={256}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100" role="alert">{error}</div>}

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500/40 border-t-slate-900" />}
            {isLoading ? 'Signing in…' : 'Open team workspace'}
          </button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-6 text-center">
          <Link href="/" className="text-sm text-white/55 transition hover:text-white">← Back to website</Link>
        </div>
      </div>
    </main>
  );
}
