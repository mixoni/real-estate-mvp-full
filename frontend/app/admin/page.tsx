'use client';

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

type Listing = {
  id: number;
  title: string;
  price: number;
  city: string;
  agent: {
    user: {
      email: string;
    };
  };
};

export default function AdminPanelPage() {
  const [pending, setPending] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get<Listing[]>('http://localhost:4000/admin/listings/pending')
      .then((res) => setPending(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: number, action: 'approve' | 'deny') => {
    await axios.post(`http://localhost:4000/admin/listings/${id}/${action}`);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="text-sm text-slate-600">
        Minimal admin view showing pending listings with Approve / Deny actions.
      </p>

      {loading && <div>Loading...</div>}

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Pending Listings</h2>
        <table className="w-full text-left text-xs">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">City</th>
              <th className="py-2">Price</th>
              <th className="py-2">Agent</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2">{l.title}</td>
                <td className="py-2">{l.city}</td>
                <td className="py-2">${l.price.toLocaleString()}</td>
                <td className="py-2">{l.agent?.user?.email}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => act(l.id, 'approve')}
                    className="mr-2 rounded bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act(l.id, 'deny')}
                    className="rounded bg-rose-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-700"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
            {!loading && pending.length === 0 && (
              <tr>
                <td className="py-3 text-center text-slate-500" colSpan={5}>
                  No pending listings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
