import React from 'react';
import { WardScore } from '@/types/wardwatch';

export default function WardLeaderboard({ scores }: { scores: WardScore[] }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
      <h2 className="text-lg font-semibold">Ward performance score</h2>
      <div className="space-y-3">
        {scores.map((row) => (
          <div
            key={row.ward}
            className="flex items-center justify-between rounded-xl bg-secondary/70 border border-border px-4 py-2.5 text-sm"
          >
            <span className="font-medium">
              {row.rank}. {row.ward}
            </span>
            <span className="font-bold text-primary">{row.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}