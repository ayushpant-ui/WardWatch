import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Complaint } from '../complaint/complaint.types';

interface RecentComplaintsProps {
  complaints: Complaint[];
}

const statusStyles: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  under_review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function RecentComplaints({
  complaints,
}: RecentComplaintsProps) {
  return (
    <section className="rounded-xl border border-border bg-card">

      <div className="flex items-center justify-between border-b border-border p-5">

        <div>
          <h2 className="font-bold">
            Recent Complaints
          </h2>

          <p className="mt-1 text-xs text-muted">
            Track your recently submitted issues.
          </p>
        </div>

        <Link
          href="/complaints"
          className="flex items-center gap-2 text-sm font-medium text-primary"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      {complaints.length === 0 ? (
        <div className="p-10 text-center">

          <p className="font-medium">
            No complaints yet
          </p>

          <p className="mt-2 text-sm text-muted">
            Report an issue in your community to get started.
          </p>

          <Link
            href="/complaints/new"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Submit Complaint
          </Link>

        </div>
      ) : (

        <div className="divide-y divide-border">

          {complaints.slice(0, 5).map((complaint) => (

            <Link
              key={complaint.id}
              href={`/complaints/${complaint.id}`}
              className="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-secondary"
            >

              <div>
                <h3 className="text-sm font-semibold">
                  {complaint.title}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  {complaint.complaintNumber} · {complaint.ward.name}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[complaint.status] || 'bg-secondary'
                }`}
              >
                {complaint.status.replace('_', ' ')}
              </span>

            </Link>

          ))}

        </div>

      )}

    </section>
  );
}