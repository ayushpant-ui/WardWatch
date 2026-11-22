'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminComplaints } from '@/hooks/useAdminComplaints';

const STATUS_BADGES: Record<string, string> = {
  Escalated: 'bg-red-500/15 text-red-500',
  'In progress': 'bg-amber-500/15 text-amber-500',
  Submitted: 'bg-slate-500/15 text-slate-400',
  Assigned: 'bg-blue-500/15 text-blue-400',
  Resolved: 'bg-emerald-500/15 text-emerald-500',
};

export default function MunicipalityComplaintsPage() {
  const { complaints, assignOfficial } = useAdminComplaints();
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('All wards');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        `#${c.id}`.includes(search);
      const matchesWard = wardFilter === 'All wards' || c.ward === wardFilter;
      const matchesStatus =
        statusFilter === 'All status' || c.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'All categories' || c.category === categoryFilter;
      const matchesOverdue = !overdueOnly || c.isOverdue;

      return (
        matchesSearch &&
        matchesWard &&
        matchesStatus &&
        matchesCategory &&
        matchesOverdue
      );
    });
  }, [complaints, search, wardFilter, statusFilter, categoryFilter, overdueOnly]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Complaints
        </h1>
        <p className="mt-1 text-sm text-muted">Kathmandu Metropolitan City</p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or ID"
            className="w-full rounded-xl border border-border bg-secondary py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium outline-none focus:border-primary"
        >
          <option value="All wards">All wards</option>
          {Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`).map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium outline-none focus:border-primary"
        >
          <option value="All status">All status</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="In progress">In progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium outline-none focus:border-primary"
        >
          <option value="All categories">All categories</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Drainage">Drainage</option>
        </select>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={overdueOnly}
            onChange={(e) => setOverdueOnly(e.target.checked)}
            className="rounded border-border accent-primary"
          />
          Overdue only
        </label>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Ward</th>
                <th className="pb-3 font-medium">Issue</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Assigned to</th>
                <th className="pb-3 font-medium">Due</th>
                <th className="pb-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="py-3.5 font-mono text-xs text-muted">
                    #{c.id}
                  </td>
                  <td className="py-3.5 text-muted">{c.ward}</td>
                  <td className="py-3.5 font-medium">{c.title}</td>
                  <td className="py-3.5 text-muted">{c.category}</td>
                  <td className="py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_BADGES[c.status] || 'bg-secondary'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-xs text-muted">
                    {c.assignedTo || 'Unassigned'}
                  </td>
                  <td
                    className={`py-3.5 text-xs ${
                      c.isOverdue ? 'font-semibold text-red-500' : 'text-muted'
                    }`}
                  >
                    {c.dueDate}
                  </td>
                  <td className="py-3.5 text-right">
                    {!c.assignedTo ? (
                      <button
                        type="button"
                        onClick={() => assignOfficial(c.id, 'S. Karki')}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
                      >
                        Assign
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary cursor-pointer"
                      >
                        Open
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
          <span>
            Showing 1 to {filtered.length} of {complaints.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 font-medium"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}