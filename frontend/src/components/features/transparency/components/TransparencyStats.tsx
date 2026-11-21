import {
  Wallet,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';

import { transparencyStats } from '../transparency.data';

const icons = [
  Wallet,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
];

export default function TransparencyStats() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {transparencyStats.map((stat, index) => {
        const Icon = icons[index];

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-muted">
                {stat.title}
              </p>

              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon size={20} />
              </div>

            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {stat.value}
            </h2>

            <p className="mt-1 text-xs text-muted">
              {stat.description}
            </p>

          </div>
        );
      })}

    </section>
  );
}