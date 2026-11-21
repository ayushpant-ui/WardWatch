'use client';

import { Menu, Bell, UserRound } from 'lucide-react';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

interface WardHeaderProps {
  onMenuClick: () => void;
}

export default function WardHeader({
  onMenuClick,
}: WardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background px-5 sm:px-8">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-secondary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="font-semibold text-foreground">
            Ward Administration
          </h2>

          <p className="text-xs text-muted">
            Manage your ward activities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <button
          className="relative rounded-lg p-2 text-muted hover:bg-secondary"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <UserRound size={19} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">
              Ward Official
            </p>

            <p className="text-xs text-muted">
              Ward Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}