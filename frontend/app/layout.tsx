import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Real Estate Marketplace MVP',
  description: 'Zillow-style marketplace MVP for Dominican Republic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="text-lg font-bold">
              <Link href="/">RealEstateDR</Link>
            </div>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-slate-700 hover:text-slate-900">
                Marketplace
              </Link>
              <Link href="/agent" className="text-slate-700 hover:text-slate-900">
                Agent Dashboard
              </Link>
              <Link href="/admin" className="text-slate-700 hover:text-slate-900">
                Admin Panel
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
