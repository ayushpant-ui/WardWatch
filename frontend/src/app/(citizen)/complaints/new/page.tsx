'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useComplaints } from '@/hooks/useComplaints';
import FileComplaintForm from '@/components/features/complaints/FileComplaintForm';

export default function NewComplaintPage() {
  const router = useRouter();
  const { createComplaint } = useComplaints();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

  <FileComplaintForm
  onSuccess={() => {
    router.push('/dashboard');
  }}
/>
    </div>
  );
}