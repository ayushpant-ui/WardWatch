import React from 'react';
import { DevelopmentProject } from '@/types/wardwatch';

const PROJECT_BADGES: Record<DevelopmentProject['status'], string> = {
  'On track': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Delayed: 'bg-red-500/15 text-red-600 dark:text-red-400',
  Completed: 'bg-primary/15 text-primary',
};

export default function ProjectsStatusCard({ projects }: { projects: DevelopmentProject[] }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
      <h2 className="text-lg font-semibold">Development projects</h2>
      <div className="divide-y divide-border">
        {projects.map((proj) => (
          <div key={proj.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{proj.name}</p>
              <p className="text-xs text-muted">Deadline: {proj.deadline}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${PROJECT_BADGES[proj.status]}`}>
              {proj.status === 'Completed' ? 'Completed' : `${proj.status} · ${proj.progress}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}