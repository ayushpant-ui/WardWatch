'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import { AdminProject } from '@/types/admin';
import ProjectFormModal from '@/components/features/projects/ProjectFormModal';

const PROJECT_BADGES: Record<AdminProject['status'], string> = {
  'On track': 'bg-emerald-500/15 text-emerald-500',
  Delayed: 'bg-red-500/15 text-red-500',
  Completed: 'bg-primary/15 text-primary',
};

export default function MunicipalityProjectsPage() {
  const { projects, saveProject } = useAdminProjects();
  const [wardFilter, setWardFilter] = useState('All wards');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);

  const visibleProjects = useMemo(() => {
    if (wardFilter === 'All wards') return projects;
    return projects.filter((p) => p.ward === wardFilter);
  }, [projects, wardFilter]);

  const counts = useMemo(() => {
    return {
      total: projects.length,
      onTrack: projects.filter((p) => p.status === 'On track').length,
      delayed: projects.filter((p) => p.status === 'Delayed').length,
    };
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Projects
        </h1>

        <div className="flex items-center gap-3">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="All wards">All wards</option>
            {Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`).map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add project
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">Total projects</p>
          <p className="mt-2 text-3xl font-bold">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">On track</p>
          <p className="mt-2 text-3xl font-bold text-primary">
            {counts.onTrack}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">Delayed</p>
          <p className="mt-2 text-3xl font-bold text-red-500">
            {counts.delayed}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Ward</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Deadline</th>
                <th className="pb-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleProjects.map((proj) => (
                <tr key={proj.id}>
                  <td className="py-4 font-semibold">{proj.name}</td>
                  <td className="py-4 text-muted">{proj.ward}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        PROJECT_BADGES[proj.status]
                      }`}
                    >
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-muted">{proj.deadline}</td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(proj);
                        setModalOpen(true);
                      }}
                      className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="pt-2 text-xs text-muted">
          Changes here appear on the public transparency page.
        </p>
      </div>

      <ProjectFormModal
        open={modalOpen}
        initialData={editingProject}
        onClose={() => setModalOpen(false)}
        onSave={saveProject}
      />
    </div>
  );
}