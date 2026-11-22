'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

const PIN_ICON = L.divIcon({
  className: 'wardwatch-location-pin',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #22c55e;
      border: 3px solid #0f172a;
      border-radius: 9999px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
      cursor: grab;
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep latest onChange callback without re-initializing the Leaflet map
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize OpenStreetMap + Draggable Marker
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: PIN_ICON,
      draggable: true,
    }).addTo(map);

    // Update coordinates when marker is dragged
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      onChangeRef.current(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
    });

    // Update coordinates when map is clicked/tapped
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChangeRef.current(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker position when "Use my location" updates latitude/longitude props
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.panTo([latitude, longitude], { animate: true });
    }
  }, [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div ref={containerRef} className="z-10 h-48 w-full cursor-crosshair" />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary px-3 py-2 text-[11px] text-muted">
        <span>
          Pin dropped at{' '}
          <strong className="font-mono text-foreground">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </strong>
        </span>
        <span>Tap the map or drag pin to move it</span>
      </div>
    </div>
  );
}