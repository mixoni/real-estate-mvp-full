'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './app/auth-context';

export function UserMenu() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href ? 'text-slate-900 font-semibold' : 'text-slate-700';

  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link href="/" className={`${isActive('/')} hover:text-slate-900`}>
        Marketplace
      </Link>

      {user?.role === 'AGENT' && (
        <Link href="/agent" className={`${isActive('/agent')} hover:text-slate-900`}>
          Agent Dashboard
        </Link>
      )}

      {user?.role === 'ADMIN' && (
        <Link href="/admin" className={`${isActive('/admin')} hover:text-slate-900`}>
          Admin Panel
        </Link>
      )}

      {!user && (
        <Link href="/login" className={`${isActive('/login')} hover:text-slate-900`}>
          Login
        </Link>
      )}

      {user && (
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs hover:bg-slate-50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
              {user.email[0]?.toUpperCase()}
            </span>
            <div className="flex flex-col items-start">
              <span className="max-w-[140px] truncate">{user.email}</span>
              <span className="text-[10px] uppercase text-slate-400">  </span>
              <span className="text-[10px] uppercase text-slate-400">
                {user.role.toLowerCase()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="max-w-[140px] truncate">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="block w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
              </span>
            </div>
          </button>
        </div>
      )}
    </nav>
  );
}
