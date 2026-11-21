'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import {
  Plus,
  Loader2,
  FileText,
  Search,
} from 'lucide-react';

import { getMyComplaints } from '../complaint/complaints.api';

import { Complaint } from '../complaint/complaint.types';

const statusStyles: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  under_review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyComplaints();
        setComplaints(response.data.data || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
            'Unable to load complaints.'
          );
        } else {
          setError('Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complaintNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === 'all' || complaint.status === status;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">
            My Complaints
          </h1>

          <p className="mt-2 text-sm text-muted">
            View and track all your submitted complaints.
          </p>
        </div>

        <Link
          href="/complaints/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white"
        >
          <Plus size={18} />
          New Complaint
        </Link>

      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />

        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950">
          {error}
        </p>
      )}

      {/* Complaints */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">

        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center">

            <FileText
              size={36}
              className="mx-auto text-muted"
            />

            <h3 className="mt-4 font-semibold">
              No complaints found
            </h3>

            <p className="mt-2 text-sm text-muted">
              Try another search or submit a new complaint.
            </p>

          </div>
        ) : (

          <div className="divide-y divide-border">

            {filteredComplaints.map((complaint) => (

              <Link
                key={complaint.id}
                href={`/complaints/${complaint.id}`}
                className="flex flex-col justify-between gap-4 p-5 transition hover:bg-secondary sm:flex-row sm:items-center"
              >

                <div>

                  <h3 className="font-semibold">
                    {complaint.title}
                  </h3>

                  <p className="mt-2 text-xs text-muted">
                    {complaint.complaintNumber}
                    {' · '}
                    {complaint.ward.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Submitted on{' '}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      statusStyles[complaint.status]
                    }`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}