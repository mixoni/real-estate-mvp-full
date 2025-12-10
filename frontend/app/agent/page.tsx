'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth-context';

type Listing = {
  id: number;
  title: string;
  price: number;
  city: string;
};

export default function AgentDashboardPage() {
  const { user, token, logout } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get<Listing[]>('http://localhost:4000/agents/1/listings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setListings(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Agent Dashboard</h1>
        <p className="text-sm text-slate-600">
          You must be logged in as an agent to view this page.
        </p>
      </div>
    );
  }

  if (user && user.role !== 'AGENT' && user.role !== 'ADMIN') {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Agent Dashboard</h1>
        <p className="text-sm text-slate-600">
          Your account does not have access to agent features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agent Dashboard</h1>
          <p className="text-sm text-slate-600">
            Listing overview for Agent #1 (from seed data).
          </p>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">My Listings</h2>
          <button className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
            + New Listing (todo)
          </button>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">City</th>
              <th className="py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2">{l.title}</td>
                <td className="py-2">{l.city}</td>
                <td className="py-2">${l.price.toLocaleString()}</td>
              </tr>
            ))}
            {!loading && listings.length === 0 && (
              <tr>
                <td className="py-3 text-center text-slate-500" colSpan={3}>
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
