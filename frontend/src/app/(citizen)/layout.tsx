import type { ReactNode } from 'react';
import CitizenNavbar from '@/components/layout/CitizenNavbar';

export default function ComplaintsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <CitizenNavbar />
      <main>{children}</main>
    </>
  );
}