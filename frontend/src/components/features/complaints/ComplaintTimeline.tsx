import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Complaint } from '@/types/wardwatch';

export default function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs text-muted uppercase tracking-wider">
            Live Tracking &bull; #{complaint.id}
          </span>
          <h3 className="text-base font-semibold mt-0.5">{complaint.title}</h3>
        </div>
        {complaint.dueDate && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted">
            <Clock className="w-3.5 h-3.5 text-primary" />
            Due by {complaint.dueDate}
          </span>
        )}
      </div>

      <p className="text-sm text-muted">{complaint.description}</p>

      <div className="pt-2 space-y-4 border-l-2 border-border ml-2.5 pl-5">
        {complaint.timeline.map((item, idx) => (
          <div key={idx} className="relative">
            <span
              className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 ${
                item.completed ? 'bg-primary border-primary' : 'bg-card border-muted'
              }`}
            />
            <p className="text-sm font-medium">{item.step}</p>
            <p className="text-xs text-muted">{item.timestamp}</p>
          </div>
        ))}
      </div>

      {complaint.status === 'Escalated' && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            This complaint exceeded its ward SLA and has been escalated to Municipal Admin.
          </span>
        </div>
      )}
    </div>
  );
}