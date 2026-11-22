'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Complaint, ComplaintStatus } from '@/types/wardwatch';

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  Submitted: '#64748b',
  'In progress': '#f59e0b',
  Resolved: '#22c55e',
  Escalated: '#ef4444',
};

interface WardComplaintsMapProps {
  complaints: Complaint[];
}

export default function WardComplaintsMap({ complaints }: WardComplaintsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] =
      complaints.length > 0
        ? [complaints[0].latitude, complaints[0].longitude]
        : [27.7172, 85.324];

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: L.Marker[] = [];

    complaints.forEach((item) => {
      const color = STATUS_COLORS[item.status] || '#22c55e';
      const icon = L.divIcon({
        className: 'ward-complaint-dot',
        html: `<div style="width:16px;height:16px;background:${color};border:2.5px solid #ffffff;border-radius:9999px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([item.latitude, item.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:12px;line-height:1.4;">
            <strong>${item.category} &bull; ${item.status}</strong><br/>
            <span>${item.title}</span>
          </div>`
        );

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [complaints]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-border">
        <div ref={containerRef} className="h-56 w-full z-10" />
      </div>

      {/* Legend matching mockup */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {(Object.keys(STATUS_COLORS) as ComplaintStatus[]).map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}