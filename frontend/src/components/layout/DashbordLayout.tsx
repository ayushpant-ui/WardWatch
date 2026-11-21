import type { ReactNode } from 'react';
import CitizenNavbar from './CitizenNavbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">

      <CitizenNavbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </main>

    </div>
  );
}