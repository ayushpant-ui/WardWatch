'use client';

import { useState } from 'react';

import CitizenSidebar from './CitizenSidebar';
import CitizenHeader from './CitizenHeader';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CitizenSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative h-full w-64">
            <CitizenSidebar />
          </div>

        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        <CitizenHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}