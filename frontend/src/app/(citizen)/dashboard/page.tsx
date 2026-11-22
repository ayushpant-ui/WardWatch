'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useComplaints } from '@/hooks/useComplaints';
import CitizenStatsStrip from '@/components/features/citizen/CitizenStatsStrip';
import ComplaintCard from '@/components/features/complaints/ComplaintCard';
import ComplaintTimeline from '@/components/features/complaints/ComplaintTimeline';
import FileComplaintForm from '@/components/features/complaints/FileComplaintForm';

export default function CitizenDashboardPage() {
    const { complaints, loading, isFallback, refetch } = useComplaints();
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [filter, setFilter] = useState<'All' | 'In progress' | 'Resolved' | 'Escalated'>('All');

  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);
  const activeComplaint =
    complaints.find((c) => c.id === selectedId) || filtered[0] || complaints[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome to Your Dashboard
            </h1>
            {isFallback && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-500 border border-amber-500/30">
                Demo Data
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1">
            Monitor your complaints and stay informed about your community.
          </p>
        </div>

        <Link
          href="/complaints/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white dark:text-slate-950 font-semibold px-4 py-2.5 text-sm transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Report an Issue
        </Link>
      </div>

      {/* KPI Strip: Filed / In progress / Resolved */}
      <CitizenStatsStrip complaints={complaints} />

      {/* 2-Column Split: Complaints + Timeline (Left) | File Complaint Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">My complaints</h2>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'In progress', 'Resolved', 'Escalated'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filter === tab
                        ? 'bg-primary text-white dark:text-slate-950 font-semibold'
                        : 'bg-secondary text-muted hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    isSelected={activeComplaint?.id === complaint.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            )}
          </div>

          {activeComplaint && <ComplaintTimeline complaint={activeComplaint} />}
        </div>

       <div className="lg:col-span-5">
  <FileComplaintForm
    onSuccess={(newComplaint) => {
      setSelectedId(newComplaint.id);
      refetch();
    }}
  />
</div>
      </div>
    </div>
  );
}