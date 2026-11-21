'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Complaints',
    href: '/complaints',
    icon: FileText,
  },
  {
    name: 'Report an Issue',
    href: '/complaints/new',
    icon: PlusCircle,
  },
  {
    name: 'My Profile',
    href: '/profile',
    icon: User,
  },
];

export default function CitizenSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');

    window.location.href = '/login';
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 border-b border-border p-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          W
        </div>

        <div>
          <h2 className="font-bold">WardWatch</h2>
          <p className="text-xs text-muted">Citizen Portal</p>
        </div>

      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Menu
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-4">

        <div className="mb-4 flex items-center gap-3 rounded-lg bg-secondary p-3">

          <ShieldCheck size={22} className="text-primary" />

          <div>
            <p className="text-xs font-semibold">
              Citizen Account
            </p>

            <p className="text-xs text-muted">
              Your voice matters
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>

    </aside>
  );
}