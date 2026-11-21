'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

const ADMIN_NAV = [
  { label: 'Overview', href: '/municipality/overview' },
  { label: 'Complaints', href: '/municipality/complaints' },
  { label: 'Projects', href: '/municipality/projects' },
  { label: 'Budget', href: '/municipality/budget' },
  { label: 'Officials', href: '/municipality/officials' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState('Municipal admin');

  useEffect(() => {
    const raw = sessionStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.name) setAdminName(parsed.name);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/municipality/overview" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white dark:text-slate-950">
            W
          </div>
          <span className="text-lg font-bold tracking-tight">WardWatch</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 font-semibold text-primary'
                    : 'text-muted hover:bg-card hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>{adminName}</span>
          </div>

          <ThemeSwitcher />

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-secondary hover:text-red-500 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {ADMIN_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium ${
                isActive ? 'bg-primary/15 text-primary' : 'text-muted'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}