'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { PlusCircle, Loader2 } from 'lucide-react';

import DashboardStats from '@/components/features/citizen/components/DashboardStats';
import RecentComplaints from '@/components/features/citizen/components/RecentComplaints';

import { getMyComplaints } from '@/components/features/citizen/complaint/complaints.api';

import { Complaint } from '@/components/features/citizen/complaint/complaint.types';

export default function CitizenDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getMyComplaints();

        setComplaints(response.data.data || []);

      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
            'Unable to load your complaints.'
          );
        } else {
          setError('Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const pending = complaints.filter(
    (item) =>
      item.status === 'submitted' ||
      item.status === 'under_review'
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === 'in_progress'
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === 'resolved'
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Welcome */}
      <section className="flex flex-wrap items-center justify-between gap-5">

        <div>
          <h1 className="text-2xl font-bold">
            Welcome to Your Dashboard
          </h1>

          <p className="mt-2 text-sm text-muted">
            Monitor your complaints and stay informed about your community.
          </p>
        </div>

        <Link
          href="/complaints/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          <PlusCircle size={18} />
          Report an Issue
        </Link>

      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={30} />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950">
          {error}
        </div>
      ) : (
        <>
          {/* Statistics */}
          <DashboardStats
            total={complaints.length}
            pending={pending}
            inProgress={inProgress}
            resolved={resolved}
          />

          {/* Recent Complaints */}
          <RecentComplaints complaints={complaints} />
        </>
      )}

    </div>
  );
}