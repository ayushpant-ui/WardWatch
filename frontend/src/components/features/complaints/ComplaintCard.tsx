import React from 'react';
import { Complaint, ComplaintStatus } from '@/types/wardwatch';

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  Submitted: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
  'In progress': 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  Resolved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Escalated: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
};

interface ComplaintCardProps {
  complaint: Complaint;
  isSelected: boolean;
  onSelect: (id: number | string) => void;
}

export default function ComplaintCard({ complaint, isSelected, onSelect }: ComplaintCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(complaint.id)}
      className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer ${
        isSelected
          ? 'bg-secondary border-primary shadow-sm'
          : 'bg-secondary/50 border-border hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted">#{complaint.id}</span>
            <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium">
              {complaint.category}
            </span>
            <span className="text-xs text-muted">Filed {complaint.filedAt}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base mt-1">{complaint.title}</h3>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-full border text-xs font-medium ${
            STATUS_STYLES[complaint.status]
          }`}
        >
          {complaint.status}
        </span>
      </div>
    </button>
  );
}