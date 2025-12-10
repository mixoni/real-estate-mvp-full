'use client';

import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { MapListing, Map } from '../components/map';

type Listing = {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  lat: number;
  lng: number;
};

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    axios
      .get<Listing[]>('http://localhost:4000/listings')
      .then((res) => setListings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesCity = city ? l.city.toLowerCase().includes(city.toLowerCase()) : true;
      const min = minPrice ? parseInt(minPrice, 10) : undefined;
      const max = maxPrice ? parseInt(maxPrice, 10) : undefined;
      const matchesMin = min !== undefined ? l.price >= min : true;
      const matchesMax = max !== undefined ? l.price <= max : true;
      return matchesCity && matchesMin && matchesMax;
    });
  }, [listings, city, minPrice, maxPrice]);

  const mapListings: MapListing[] = filtered.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price,
    lat: l.lat,
    lng: l.lng,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <p className="text-sm text-slate-600">
        Server data from NestJS, client filters + interactive Mapbox map.
      </p>

      <div className="grid gap-4 md:grid-cols-[320px,1fr]">
        {/* Filters + list */}
        <div className="space-y-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold">Filters</h2>
            <div className="space-y-2 text-sm">
              <div>
                <label className="block text-xs text-slate-500">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                  placeholder="e.g. Santo Domingo"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Min price</label>
                  <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    placeholder="e.g. 100000"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Max price</label>
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    placeholder="e.g. 500000"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading && <div>Loading listings...</div>}

          <div className="space-y-3">
            {filtered.map((listing) => (
              <div key={listing.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{listing.title}</h2>
                  <span className="text-sm font-semibold text-emerald-600">
                    ${listing.price.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-700">{listing.description}</p>
                <div className="mt-3 text-xs text-slate-500">{listing.city}</div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="text-xs text-slate-500">No listings match your filters.</div>
            )}
          </div>
        </div>

        <div className="h-[500px] rounded-lg border bg-slate-100 p-2">
          <Map listings={mapListings} />
        </div>
      </div>
    </div>
  );
}
