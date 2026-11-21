'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, MapPin, User } from 'lucide-react';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

const NAV_ITEMS = [
  { label: 'My Complaints', href: '/complaints' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Transparency', href: '/transparency' },
];

export default function CitizenNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Citizen');

  useEffect(() => {
    const raw = sessionStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.name) setUserName(parsed.name);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/complaints" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-bold text-white dark:text-slate-950 text-lg">
            W
          </div>
          <div className="leading-tight">
            <span className="font-bold text-lg tracking-tight block">WardWatch</span>
            <span className="text-[11px] text-muted hidden sm:block">
              Smart Governance Platform
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted hover:text-foreground hover:bg-card'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Kathmandu &bull; Ward 10</span>
          </div>

          <ThemeSwitcher />

          <Link
            href="/profile"
            title={userName}
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <User className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:text-red-500 hover:bg-secondary cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}