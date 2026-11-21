import { ReactNode } from 'react';
import WardLayout from '@/components/features/ward-admin/components/WardLayout';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <WardLayout>{children}</WardLayout>;
}