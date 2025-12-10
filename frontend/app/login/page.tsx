'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'AGENT') {
        router.push('/agent');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="mt-1 text-xs text-slate-600">
        For test purposes, use one of the following accounts:
      </p>
      <p className="mt-1 text-xs text-slate-600">
        admin@example.com / admin123 OR
      </p>
      <p className="mt-1 text-xs text-slate-600">
        agent@example.com / agent123
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3 text-sm">
        <div>
          <label className="block text-xs text-slate-500">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <div className="text-xs text-rose-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
