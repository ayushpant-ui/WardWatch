'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  const { stats, queue, ranking } = useAdminOverview(selectedWard);

  const visibleQueue =
    statusFilter === 'All status'
      ? queue
      : queue.filter((q) => q.status === statusFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Kathmandu Metro overview
        </h1>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="self-start rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium outline-none focus:border-primary sm:self-auto"
        >
          <option value="All wards">All wards</option>
          {Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`).map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* 4 KPI Cards */}
      <MunicipalityStatsStrip stats={stats} />

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
                {visibleQueue.map((item) => (
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
                        item.isOverdue
                          ? 'font-semibold text-red-500'
                          : 'text-muted'
                      }`}
                    >
                      {item.dueDate}
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
                ))}
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