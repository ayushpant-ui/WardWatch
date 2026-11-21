import React from 'react';
import { CheckCircle2, FileText, Wrench } from 'lucide-react';
import { Complaint } from '@/types/wardwatch';

export default function CitizenStatsStrip({ complaints }: { complaints: Complaint[] }) {
  const filed = complaints.length;
  const inProgress = complaints.filter(
    (c) => c.status === 'In progress' || c.status === 'Escalated'
  ).length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Filed</p>
          <p className="text-3xl font-bold mt-1">{filed}</p>
        </div>
        <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider">In progress</p>
          <p className="text-3xl font-bold mt-1 text-amber-500">{inProgress}</p>
        </div>
        <div className="h-11 w-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
          <Wrench className="w-5 h-5" />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Resolved</p>
          <p className="text-3xl font-bold mt-1 text-emerald-500">{resolved}</p>
        </div>
        <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}