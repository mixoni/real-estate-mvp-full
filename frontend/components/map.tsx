'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export type MapListing = {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
};

type Props = {
  listings: MapListing[];
};

export function Map({ listings }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // inicijalizacija mape
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !mapboxgl.accessToken) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-69.9, 18.5], // DR centar
      zoom: 6,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, []);

  // update markers depending on listings applied by filters
  useEffect(() => {
    if (!mapRef.current) return;

    // 1) remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 2) add news
    listings.forEach((listing) => {
      const el = document.createElement('div');
      el.className =
        'rounded-full bg-emerald-600 text-white text-[10px] px-2 py-1 shadow font-medium';
      el.innerText = '$' + (listing.price / 1000).toFixed(0) + 'k';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.lng, listing.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 8 }).setHTML(
            `<strong>${listing.title}</strong><br/>$${listing.price.toLocaleString()}`,
          ),
        )
        .addTo(mapRef.current as mapboxgl.Map);

      markersRef.current.push(marker);
    });

    if (listings.length > 0) {
      const lats = listings.map((l) => l.lat);
      const lngs = listings.map((l) => l.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 500 },
      );
    }
  }, [listings]);

  return (
    <div
      ref={mapContainerRef}
      className="relative h-full w-full rounded-lg overflow-hidden"
    />
  );
}
