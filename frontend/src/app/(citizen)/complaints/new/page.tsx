import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import ComplaintForm from '@/components/features/citizen/components/ComplaintForm';

export default function NewComplaintPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-7">

      <div>
        <Link
          href="/complaints"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to complaints
        </Link>

        <h1 className="text-2xl font-bold">
          Report a Community Issue
        </h1>

        <p className="mt-2 text-sm text-muted">
          Help improve your community by reporting problems that need attention.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
        <ComplaintForm />
      </div>

    </div>
  );
}