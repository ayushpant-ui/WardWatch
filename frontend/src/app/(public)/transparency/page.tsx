'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import {
  getTransparencyData,
  TransparencyData,
} from '@/components/features/transparency/transparency.api';

const MUNICIPALITIES = [
  { label: 'Bhimdatta Municipality', value: 'Bhimdatta Municipality', wards: 19 },
  {
    label: 'Kathmandu Metropolitan City',
    value: 'Kathmandu Metropolitan City',
    wards: 32,
  },
  { label: 'All Municipalities', value: 'all', wards: 32 },
] as const;

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString('en-NP')}`;
}

export default function TransparencyPage() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>(
    'Bhimdatta Municipality',
  );
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [data, setData] = useState<TransparencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeMuniConfig =
    MUNICIPALITIES.find((m) => m.value === selectedMunicipality) ??
    MUNICIPALITIES[0];
  const wardOptions = Array.from(
    { length: activeMuniConfig.wards },
    (_, i) => i + 1,
  );

  const handleMunicipalityChange = (newMunicipality: string) => {
    setSelectedMunicipality(newMunicipality);
    setSelectedWard('all'); // Reset ward filter when changing municipality
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getTransparencyData(selectedMunicipality, selectedWard)
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setError('Unable to load transparency records right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedMunicipality, selectedWard]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header & Municipality + Ward Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 size={14} />
            Open Civic Portal — {activeMuniConfig.label}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Public Budget & Ward Transparency
          </h1>
          <p className="mt-1 text-sm text-muted">
            Real-time ward budgets, infrastructure project progress, and citizen issue resolution metrics.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Municipality Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="municipality-filter"
              className="text-xs font-medium text-muted"
            >
              Municipality:
            </label>
            <select
              id="municipality-filter"
              value={selectedMunicipality}
              onChange={(e) => handleMunicipalityChange(e.target.value)}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium outline-none focus:border-primary"
            >
              {MUNICIPALITIES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="ward-filter"
              className="text-xs font-medium text-muted"
            >
              Ward:
            </label>
            <select
              id="ward-filter"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium outline-none focus:border-primary"
            >
              <option value="all">
                All Wards (1–{activeMuniConfig.wards})
              </option>
              {wardOptions.map((w) => (
                <option key={w} value={String(w)}>
                  Ward {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error || !data ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error || 'No transparency data available.'}
        </div>
      ) : (() => {
        const payload = (data as any)?.data ?? data;
        const summary = payload?.summary ?? {
          totalAllocated: 0,
          totalSpent: 0,
          utilizationRate: 0,
          totalProjects: 0,
          totalComplaints: 0,
          resolvedComplaints: 0,
          resolutionRate: 0,
        };
        const wardBreakdown = Array.isArray(payload?.wardBreakdown)
          ? payload.wardBreakdown
          : [];
        const projects = Array.isArray(payload?.projects) ? payload.projects : [];
        const recentComplaints = Array.isArray(payload?.recentComplaints)
          ? payload.recentComplaints
          : [];

        return (
          <>
            {/* KPI Summary Strip */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Total Allocated Budget</span>
                  <FileSpreadsheet size={16} className="text-primary" />
                </div>
                <p className="mt-2 text-xl font-bold">
                  {formatNPR(Number(summary.totalAllocated ?? 0))}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Spent: {formatNPR(Number(summary.totalSpent ?? 0))} (
                  {summary.utilizationRate ?? 0}%)
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Development Projects</span>
                  <FolderKanban size={16} className="text-primary" />
                </div>
                <p className="mt-2 text-xl font-bold">
                  {summary.totalProjects ?? 0}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Active & completed ward works
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Public Issues Logged</span>
                  <ShieldAlert size={16} className="text-amber-500" />
                </div>
                <p className="mt-2 text-xl font-bold">
                  {summary.totalComplaints ?? 0}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {summary.resolvedComplaints ?? 0} resolved
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Resolution Rate</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <p className="mt-2 text-xl font-bold">
                  {summary.resolutionRate ?? 0}%
                </p>
                <p className="mt-1 text-xs text-muted">
                  Municipal accountability index
                </p>
              </div>
            </div>

            {/* Ward Budget & Performance Table */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                Ward-by-Ward Budget & Resolution ({activeMuniConfig.label})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-muted">
                      <th className="py-3 pr-4">Ward</th>
                      <th className="py-3 px-4">Allocated</th>
                      <th className="py-3 px-4">Spent</th>
                      <th className="py-3 px-4">Utilization</th>
                      <th className="py-3 px-4">Projects</th>
                      <th className="py-3 pl-4">Issue Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {wardBreakdown.map((w: any) => (
                      <tr key={w.wardNo} className="hover:bg-secondary/40">
                        <td className="py-3 pr-4 font-semibold">
                          Ward {w.wardNo}
                        </td>
                        <td className="py-3 px-4">
                          {formatNPR(Number(w.allocated ?? 0))}
                        </td>
                        <td className="py-3 px-4">
                          {formatNPR(Number(w.spent ?? 0))}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${Math.min(w.utilization ?? 0, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted">
                              {w.utilization ?? 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{w.projectsCount ?? 0}</td>
                        <td className="py-3 pl-4">
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {w.resolution ?? 0}% ({w.resolvedComplaints ?? 0}/
                            {w.totalComplaints ?? 0})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Split: Public Projects & Recent Civic Issues */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  Ward Development Projects
                </h2>
                {projects.length === 0 ? (
                  <p className="text-sm text-muted">
                    No projects published for this selection.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project: any) => (
                      <div
                        key={project.id}
                        className="rounded-xl border border-border bg-background p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {project.title}
                            </p>
                            <p className="text-xs text-muted">
                              Ward {project.wardNo} • Deadline:{' '}
                              {project.deadline}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>Completion Progress</span>
                          <span>{project.progress ?? 0}% complete</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${Math.min(project.progress ?? 0, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Recent Public Issues</h2>
                {recentComplaints.length === 0 ? (
                  <p className="text-sm text-muted">
                    No public complaints logged for this selection yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentComplaints.map((c: any) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {c.title}
                          </p>
                          <p className="text-xs text-muted">
                            {c.municipality ? `${c.municipality} • ` : ''}Ward{' '}
                            {c.ward} • {c.category} • {c.filedAt}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}