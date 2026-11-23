'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useAdminOverview } from '@/hooks/useAdminOverview';
import MunicipalityStatsStrip from '@/components/features/admin/MunicipalityStatsStrip';
import WardRankingCard from '@/components/features/admin/WardRankingCard';

const STATUS_BADGES: Record<string, string> = {
  Escalated: 'bg-red-500/15 text-red-500',
  'In progress': 'bg-amber-500/15 text-amber-500',
  Submitted: 'bg-slate-500/15 text-slate-400',
  Resolved: 'bg-emerald-500/15 text-emerald-500',
};

export default function MunicipalityOverviewPage() {
  const [selectedWard, setSelectedWard] = useState('All wards');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [municipalityName, setMunicipalityName] = useState('Municipality');
  const [wardCount, setWardCount] = useState(32);

  const { stats, queue, ranking } = useAdminOverview(selectedWard);

useEffect(() => {
  const rawUser =
    sessionStorage.getItem('user') || localStorage.getItem('user');
  if (!rawUser) return;

  try {
    const parsed = JSON.parse(rawUser);
    console.log('Stored user payload:', parsed); // Check actual shape in DevTools

    // Handle flat or nested user object, and string or object municipality
    const userObj = parsed?.user ?? parsed;
    const rawMuni =
      typeof userObj?.municipality === 'string'
        ? userObj.municipality
        : userObj?.municipality?.name || userObj?.municipalityName;

    if (rawMuni) {
      setMunicipalityName(rawMuni);
      const isBhimdatta = /bhimd[au]tta|भीमदत्त/i.test(rawMuni);
      setWardCount(isBhimdatta ? 19 : 32);
    }
  } catch (err) {
    console.error('Failed to parse user from storage:', err);
  }
}, []);

  // Any issue > 7 days old is auto-marked status === 'Escalated' by the backend
  const escalatedIssues = queue.filter((q) => q.status === 'Escalated');

  const visibleQueue =
    statusFilter === 'All status'
      ? queue
      : queue.filter((q) => q.status === statusFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {municipalityName} overview
          </h1>
          <p className="mt-1 text-xs text-muted">
            Municipal SLA monitoring, ward complaint queue, and ward performance rankings.
          </p>
        </div>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="self-start rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium outline-none focus:border-primary sm:self-auto"
        >
          <option value="All wards">All wards (1–{wardCount})</option>
          {Array.from({ length: wardCount }, (_, i) => `Ward ${i + 1}`).map(
            (w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ),
          )}
        </select>
      </div>

      {/* 4 KPI Cards */}
      <MunicipalityStatsStrip stats={stats} />

      {/* Escalated Issues (> 7 Days Unresolved) Alert Section */}
      {escalatedIssues.length > 0 && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
                  SLA Breach (&gt; 7 Days Unresolved)
                </span>
                <h2 className="text-base font-bold text-foreground">
                  Escalated Ward Issues ({escalatedIssues.length})
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStatusFilter('Escalated')}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 cursor-pointer"
            >
              Filter Queue to Escalated
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {escalatedIssues.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-card p-4"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-red-500">
                      {item.ward}
                    </span>
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-500">
                      Escalated
                    </span>
                  </div>
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  {item.dueDate && (
                    <p className="text-xs text-muted">Due: {item.dueDate}</p>
                  )}
                </div>

                <Link
                  href="/municipality/complaints"
                  className="shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  Take Action
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split: Complaint Queue (Left) + Ward Ranking (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">
              Complaint queue (all wards)
            </h2>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium outline-none focus:border-primary"
            >
              <option value="All status">Filter: All status</option>
              <option value="Escalated">Escalated</option>
              <option value="In progress">In progress</option>
              <option value="Submitted">Submitted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Ward</th>
                  <th className="pb-3 font-medium">Issue</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Due</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleQueue.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-xs text-muted"
                    >
                      No complaints found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  visibleQueue.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5 text-muted">{item.ward}</td>
                      <td className="py-3.5 font-medium">{item.title}</td>
                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            STATUS_BADGES[item.status] || 'bg-secondary'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 text-xs ${
                          item.isOverdue || item.status === 'Escalated'
                            ? 'font-semibold text-red-500'
                            : 'text-muted'
                        }`}
                      >
                        {item.dueDate || '—'}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/municipality/complaints"
                          className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4">
          <WardRankingCard ranking={ranking} />
        </div>
      </div>
    </div>
  );
}