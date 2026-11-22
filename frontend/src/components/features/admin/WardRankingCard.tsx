import React from 'react';
import { WardRankingItem } from '@/types/admin';

interface WardRankingCardProps {
  ranking: WardRankingItem[];
}

export default function WardRankingCard({ ranking }: WardRankingCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Ward ranking</h2>
        <span className="text-xs text-muted">Score / 100</span>
      </div>

      {ranking.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted">
          No ward ranking data available.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {ranking.map((item, index) => {
            const isLow = item.score < 60;
            return (
              <div
                key={item.ward}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.ward}</span>
                </div>

                <span
                  className={`font-bold ${
                    isLow ? 'text-red-500' : 'text-primary'
                  }`}
                >
                  {item.score}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}