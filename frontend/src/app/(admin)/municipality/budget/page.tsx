'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminBudget } from '@/hooks/useAdminBudget';
import { AdminBudgetItem } from '@/types/admin';
import BudgetFormModal from '@/components/features/budget/BudgetFormModal';

export default function MunicipalityBudgetPage() {
  const { items, recentChanges, saveBudgetItem } = useAdminBudget();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBudgetItem | null>(null);

  const totals = useMemo(() => {
    const allocated = items.reduce((sum, i) => sum + i.allocated, 0);
    const spent = items.reduce((sum, i) => sum + i.spent, 0);
    const utilization =
      allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
    return { allocated, spent, utilization };
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Budget
        </h1>

        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted">
            FY 2083/84
          </span>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add budget item
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">Allocated</p>
          <p className="mt-2 text-3xl font-bold">
            Rs {totals.allocated.toFixed(1)}M
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">Spent</p>
          <p className="mt-2 text-3xl font-bold text-primary">
            Rs {totals.spent.toFixed(1)}M
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted">Utilization</p>
          <p className="mt-2 text-3xl font-bold">{totals.utilization}%</p>
        </div>
      </div>

      {/* Budget Allocation Table */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="pb-3 font-medium">Ward</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Allocated</th>
                <th className="pb-3 font-medium">Spent</th>
                <th className="pb-3 font-medium">Utilization</th>
                <th className="pb-3 font-medium">Updated by</th>
                <th className="pb-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((row) => {
                const pct = Math.min(
                  100,
                  Math.round((row.spent / row.allocated) * 100)
                );
                return (
                  <tr key={row.id}>
                    <td className="py-4 font-semibold">{row.ward}</td>
                    <td className="py-4 text-muted">{row.category}</td>
                    <td className="py-4">Rs {row.allocated.toFixed(1)}M</td>
                    <td className="py-4">Rs {row.spent.toFixed(1)}M</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct < 50 ? 'bg-amber-500' : 'bg-primary'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-muted">{row.updatedBy}</td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(row);
                          setModalOpen(true);
                        }}
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Changes Audit Log */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold">Recent changes</h2>
        <div className="divide-y divide-border">
          {recentChanges.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0 text-sm"
            >
              <div>
                <span className="font-semibold">
                  {log.ward} &bull; {log.category}
                </span>
                <span className="ml-3 text-xs text-muted">
                  {log.description}
                </span>
              </div>
              <span className="text-xs text-muted">
                {log.updatedBy} &bull; {log.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BudgetFormModal
        open={modalOpen}
        initialData={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={saveBudgetItem}
      />
    </div>
  );
}