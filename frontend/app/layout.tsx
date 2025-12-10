import './globals.css';
import React from 'react';
import Link from 'next/link';
import { AuthProvider } from './auth-context';
import { UserMenu } from '../user-menu';

export const metadata = {
  title: 'Real Estate Marketplace MVP',
  description: 'Zillow-style marketplace MVP for Dominican Republic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="text-lg font-bold">
                <Link href="/">RealEstateDR</Link>
              </div>
              <UserMenu />
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
