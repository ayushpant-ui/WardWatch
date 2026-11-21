'use client';

import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

interface CitizenHeaderProps {
  onMenuClick: () => void;
}

export default function CitizenHeader({
  onMenuClick,
}: CitizenHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8">

      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-secondary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-sm font-semibold">
            Citizen Portal
          </h1>

          <p className="text-xs text-muted">
            WardWatch Dashboard
          </p>
        </div>

      </div>

      <div className="flex items-center gap-4">

        <button
          className="relative rounded-lg p-2 hover:bg-secondary"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
        >
          C
        </Link>

      </div>

    </header>
  );
}