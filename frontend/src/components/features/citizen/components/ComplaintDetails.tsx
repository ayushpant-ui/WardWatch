'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { ArrowLeft, Loader2, MapPin } from 'lucide-react';

import { getComplaintById } from '../complaint/complaints.api';

import { Complaint } from '../complaint/complaint.types';

const statuses = [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
];

export default function ComplaintDetails() {
  const params = useParams();
  const id = Number(params.id);

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await getComplaintById(id);
        setComplaint(data);
      } catch {
        setError('Unable to load complaint details.');
      } finally {
        setLoading(false);
      }
    };

    if (Number.isInteger(id) && id > 0) {
      fetchComplaint();
    } else {
      setError('Invalid complaint ID.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={30} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="text-red-500">{error || 'Complaint not found.'}</p>
        <Link href="/complaints" className="mt-4 inline-block text-sm text-primary">
          Back to complaints
        </Link>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(complaint.status);

  return (
    <div className="mx-auto max-w-4xl space-y-7">

      <Link
        href="/complaints"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft size={17} />
        Back to complaints
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>
            <p className="text-sm text-muted">
              {complaint.complaintNumber}
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              {complaint.title}
            </h1>

            <p className="mt-2 text-sm text-muted">
              Submitted on{' '}
              {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium capitalize text-primary">
            {complaint.status.replace('_', ' ')}
          </span>

        </div>

        <div className="mt-8 space-y-3">

          <h2 className="font-semibold">
            Complaint Description
          </h2>

          <p className="text-sm leading-7 text-muted">
            {complaint.description}
          </p>

        </div>

        <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">

          <div>
            <p className="text-xs text-muted">Category</p>
            <p className="mt-2 text-sm font-medium capitalize">
              {complaint.category.replace('_', ' ')}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Ward</p>
            <p className="mt-2 text-sm font-medium">
              {complaint.ward.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Location</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} />
              {complaint.address || 'Location not provided'}
            </p>
          </div>

        </div>

        {complaint.photoUrl && (
          <div className="mt-7 border-t border-border pt-6">

            <h2 className="mb-3 font-semibold">
              Supporting Photograph
            </h2>

            <img
              src={complaint.photoUrl}
              alt="Complaint evidence"
              className="max-h-80 rounded-xl object-cover"
            />

          </div>
        )}

      </div>

      {/* Status Timeline */}
      <div className="rounded-xl border border-border bg-card p-6">

        <h2 className="text-lg font-bold">
          Complaint Progress
        </h2>

        {complaint.status === 'rejected' ? (
          <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            This complaint has been rejected. Contact the responsible ward office for further information.
          </p>
        ) : (

          <div className="mt-7 space-y-6">

            {statuses.map((status, index) => {

              const completed = index <= currentIndex;

              return (
                <div key={status} className="flex gap-4">

                  <div className="flex flex-col items-center">

                    <div
                      className={`h-4 w-4 rounded-full ${
                        completed ? 'bg-primary' : 'bg-secondary'
                      }`}
                    />

                    {index !== statuses.length - 1 && (
                      <div className={`h-10 w-0.5 ${
                        completed ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}

                  </div>

                  <div>
                    <p className={`text-sm font-medium capitalize ${
                      completed ? 'text-foreground' : 'text-muted'
                    }`}>
                      {status.replace('_', ' ')}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}