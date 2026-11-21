'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useComplaints } from '@/hooks/useComplaints';
import { useWardTransparency } from '@/hooks/useWardTransparency';
import { WARDS_LIST } from '@/lib/nepal-locations';
import BudgetProgressCard from '@/components/features/transparency/BudgetProgressCard';
import ProjectsStatusCard from '@/components/features/transparency/ProjectsStatusCard';
import WardLeaderboard from '@/components/features/transparency/WardLeaderboard';

const WardComplaintsMap = dynamic(() => import('@/components/maps/WardComplaintsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full rounded-xl bg-secondary border border-border animate-pulse flex items-center justify-center text-xs text-muted">
      Loading Ward Map...
    </div>
  ),
});

export default function CitizenTransparencyPage() {
  const [selectedWard, setSelectedWard] = useState('Ward 10');
  const { budgets, projects, scores } = useWardTransparency(selectedWard);
  const { complaints } = useComplaints();

  return (
    <div className="space-y-8">
      {/* Header & Ward Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See where your ward&apos;s money goes
          </h1>
          <p className="text-sm text-muted mt-1">
            Bagmati &bull; Kathmandu &bull; Kathmandu Metro &bull; {selectedWard}
          </p>
        </div>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="rounded-xl bg-card border border-border px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary self-start sm:self-auto"
        >
          {WARDS_LIST.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* 2x2 Quadrant Grid matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgressCard budgets={budgets} />
        <ProjectsStatusCard projects={projects} />
        <WardLeaderboard scores={scores} />

        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Complaints map</h2>
            <span className="text-xs font-medium text-muted">{selectedWard}</span>
          </div>
          <WardComplaintsMap complaints={complaints} />
        </div>
      </div>
    </div>
  );
}