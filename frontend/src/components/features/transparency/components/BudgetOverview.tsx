import { Wallet } from 'lucide-react';

import { budgetCategories } from '../transparency.data';

export default function BudgetOverview() {
  const totalAllocated = budgetCategories.reduce(
    (total, item) => total + item.allocated,
    0
  );

  const totalSpent = budgetCategories.reduce(
    (total, item) => total + item.spent,
    0
  );

  const remaining = totalAllocated - totalSpent;

  const percentage = Math.round(
    (totalSpent / totalAllocated) * 100
  );

  const formatCurrency = (amount: number) =>
    `Rs. ${(amount / 100000).toFixed(1)} Lakh`;

  return (
    <section className="rounded-xl border border-border bg-card p-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <Wallet className="text-primary" size={21} />

            <h2 className="text-xl font-bold">
              Budget Overview
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted">
            Municipality budget utilization by sector.
          </p>
        </div>

        <span className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium">
          FY 2083/84
        </span>

      </div>

      {/* Budget Summary */}
      <div className="mt-7 grid gap-5 sm:grid-cols-3">

        <div>
          <p className="text-sm text-muted">
            Total Allocated
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {formatCurrency(totalAllocated)}
          </h3>
        </div>

        <div>
          <p className="text-sm text-muted">
            Total Spent
          </p>

          <h3 className="mt-2 text-xl font-bold text-primary">
            {formatCurrency(totalSpent)}
          </h3>
        </div>

        <div>
          <p className="text-sm text-muted">
            Remaining Budget
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {formatCurrency(remaining)}
          </h3>
        </div>

      </div>

      {/* Overall Progress */}
      <div className="mt-7">

        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium">
            Overall Budget Utilization
          </span>

          <span className="font-semibold text-primary">
            {percentage}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>

      </div>

      {/* Category Breakdown */}
      <div className="mt-8 space-y-6">

        <h3 className="font-semibold">
          Sector-wise Expenditure
        </h3>

        {budgetCategories.map((category) => {
          const progress = Math.round(
            (category.spent / category.allocated) * 100
          );

          return (
            <div key={category.name}>

              <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">

                <span className="font-medium">
                  {category.name}
                </span>

                <span className="text-muted">
                  {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-1 text-right text-xs text-muted">
                {progress}% utilized
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}