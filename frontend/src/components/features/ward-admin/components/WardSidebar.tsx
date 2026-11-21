'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  Wallet,
  Users,
  ChartNoAxesCombined,
  Eye,
  Settings,
  X,
  MapPin,
} from 'lucide-react';

interface WardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    title: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        href: '/ward/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'WARD MANAGEMENT',
    items: [
      {
        name: 'Complaints',
        href: '/ward/complaints',
        icon: MessageSquare,
      },
      {
        name: 'Development Projects',
        href: '/ward/projects',
        icon: Building2,
      },
      {
        name: 'Budget & Finance',
        href: '/ward/budget',
        icon: Wallet,
      },
      {
        name: 'Officials',
        href: '/ward/officials',
        icon: Users,
      },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      {
        name: 'Reports',
        href: '/ward/reports',
        icon: ChartNoAxesCombined,
      },
      {
        name: 'Transparency',
        href: '/ward/transparency',
        icon: Eye,
      },
    ],
  },
];

export default function WardSidebar({
  open,
  onClose,
}: WardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link href="/ward/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
              W
            </div>

            <div>
              <h1 className="font-bold text-foreground">
                WardWatch
              </h1>
              <p className="text-xs text-muted">
                Ward Administration
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Ward Information */}
        <div className="mx-4 mt-5 rounded-xl bg-secondary p-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin size={17} />

            <span className="text-sm font-semibold">
              Ward No. 05
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">
            Municipality Name
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    (item.href !== '/ward/dashboard' &&
                      pathname.startsWith(item.href + '/'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-muted hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon size={19} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div className="border-t border-border p-4">
          <Link
            href="/ward/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-secondary hover:text-foreground"
          >
            <Settings size={19} />
            My Profile
          </Link>
        </div>
      </aside>
    </>
  );
}