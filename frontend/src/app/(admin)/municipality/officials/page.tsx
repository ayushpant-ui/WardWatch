'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';

interface OfficialRecord {
  id: number;
  name: string;
  email: string;
  municipality?: string;
  ward: string;
  ward_no?: number;
  designation?: string | null;
  requestedAt: string;
  lastLogin: string;
  status: 'pending' | 'active' | 'deactivated';
}

export default function MunicipalityOfficialsPage() {
  const [officials, setOfficials] = useState<OfficialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [municipalityName, setMunicipalityName] = useState('');

  useEffect(() => {
    const rawUser =
      sessionStorage.getItem('user') || localStorage.getItem('user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user?.municipality) setMunicipalityName(user.municipality);
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const fetchOfficials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<OfficialRecord[]>('/admin/officials');
      setOfficials(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load officials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id);
      await api.patch(`/admin/officials/${id}/approve`);
      await fetchOfficials();
    } catch (err) {
      console.error('Failed to approve official:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setProcessingId(id);
      await api.delete(`/admin/officials/${id}/reject`);
      await fetchOfficials();
    } catch (err) {
      console.error('Failed to reject official:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusToggle = async (
    id: number,
    nextStatus: 'active' | 'deactivated',
  ) => {
    try {
      setProcessingId(id);
      await api.patch(`/admin/officials/${id}/status`, { status: nextStatus });
      await fetchOfficials();
    } catch (err) {
      console.error('Failed to update official status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingOfficials = officials.filter((o) => o.status === 'pending');
  const activeOrDeactivatedOfficials = officials.filter(
    (o) => o.status !== 'pending',
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <ShieldCheck size={15} />
          {municipalityName || 'Municipality'} Access Control
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Ward Officials
        </h1>
        <p className="mt-1 text-sm text-muted">
          Review ward official registration requests and manage active ward console accounts.
        </p>
      </div>

      {/* Pending Approval Section (Live from DB) */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold">
            Pending approval ({pendingOfficials.length})
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Officials register with their official email. Their account stays inactive until you approve it.
          </p>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : pendingOfficials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted">
            No pending ward official registration requests right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Requested ward</th>
                  <th className="pb-3 font-medium">Requested</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingOfficials.map((item) => {
                  const busy = processingId === item.id;
                  return (
                    <tr key={item.id}>
                      <td className="py-4">
                        <p className="font-semibold">{item.name}</p>
                        {item.designation && (
                          <p className="text-xs text-muted">{item.designation}</p>
                        )}
                      </td>
                      <td className="py-4 text-muted">{item.email}</td>
                      <td className="py-4">{item.ward}</td>
                      <td className="py-4 text-muted">{item.requestedAt}</td>
                      <td className="py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleApprove(item.id)}
                            className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleReject(item.id)}
                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved / Active Ward Officials Section */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-base font-bold">
          Registered Ward Officials ({activeOrDeactivatedOfficials.length})
        </h2>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : activeOrDeactivatedOfficials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted">
            No approved ward officials yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Assigned Ward</th>
                  <th className="pb-3 font-medium">Last Login</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeOrDeactivatedOfficials.map((official) => {
                  const busy = processingId === official.id;
                  return (
                    <tr key={official.id}>
                      <td className="py-4">
                        <p className="font-semibold">{official.name}</p>
                        {official.designation && (
                          <p className="text-xs text-muted">
                            {official.designation}
                          </p>
                        )}
                      </td>
                      <td className="py-4 text-muted">{official.email}</td>
                      <td className="py-4">{official.ward}</td>
                      <td className="py-4 text-muted">{official.lastLogin}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            official.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {official.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {official.status === 'active' ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusToggle(official.id, 'deactivated')
                            }
                            className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted hover:text-red-400 disabled:opacity-50 cursor-pointer"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusToggle(official.id, 'active')
                            }
                            className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50 cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}