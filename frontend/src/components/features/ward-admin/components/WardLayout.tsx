'use client';

import { ReactNode, useState } from 'react';

import WardSidebar from './WardSidebar';
import WardHeader from './WardHeader';

export default function WardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary">

      <WardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">

        <WardHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-5 sm:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}