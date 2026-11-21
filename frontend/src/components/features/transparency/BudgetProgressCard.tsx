import React from 'react';
import { BudgetItem } from '@/types/wardwatch';

export default function BudgetProgressCard({ budgets }: { budgets: BudgetItem[] }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
      <h2 className="text-lg font-semibold">Budget vs spent</h2>
      <div className="space-y-4">
        {budgets.map((item) => {
          const pct = Math.min(100, Math.round((item.spent / item.allocated) * 100));
          const isLowUtilization = pct < 50;
          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {item.category}{' '}
                  <span className="text-muted font-normal">
                    &bull; Rs {item.spent.toFixed(1)}M of {item.allocated.toFixed(1)}M
                  </span>
                </span>
                <span className="text-xs font-mono text-muted">{pct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLowUtilization ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}