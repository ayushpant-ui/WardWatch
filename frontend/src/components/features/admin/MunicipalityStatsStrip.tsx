import React from 'react';
import { MunicipalOverviewStats } from '@/types/admin';

export default function MunicipalityStatsStrip({
  stats,
}: {
  stats: MunicipalOverviewStats;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted">Open complaints</p>
        <p className="mt-2 text-3xl font-bold">{stats.openComplaints}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted">Overdue</p>
        <p className="mt-2 text-3xl font-bold text-red-500">
          {stats.overdueComplaints}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted">Avg resolution</p>
        <p className="mt-2 text-3xl font-bold">{stats.avgResolutionDays} days</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted">Municipality score</p>
        <p className="mt-2 text-3xl font-bold text-primary">
          {stats.municipalityScore}
        </p>
      </div>
    </div>
  );
}