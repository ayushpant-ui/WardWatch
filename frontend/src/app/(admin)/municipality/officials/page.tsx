'use client';

import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminOfficials } from '@/hooks/useAdminOfficials';
import InviteOfficialModal from '@/components/features/officials/InviteOfficialModal';

export default function MunicipalityOfficialsPage() {
  const {
    officials,
    approveOfficial,
    rejectOfficial,
    toggleOfficialStatus,
    inviteOfficial,
  } = useAdminOfficials();

  const [tab, setTab] = useState<'pending' | 'active' | 'deactivated'>('pending');
  const [inviteOpen, setInviteOpen] = useState(false);

  const pendingList = useMemo(
    () => officials.filter((o) => o.status === 'pending'),
    [officials]
  );
  const activeList = useMemo(
    () => officials.filter((o) => o.status === 'active'),
    [officials]
  );
  const deactivatedList = useMemo(
    () => officials.filter((o) => o.status === 'deactivated'),
    [officials]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Officials
        </h1>

        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:opacity-90 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Invite official
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('pending')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            tab === 'pending'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'bg-card border border-border text-muted hover:text-foreground'
          }`}
        >
          Pending approval ({pendingList.length})
        </button>

        <button
          type="button"
          onClick={() => setTab('active')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            tab === 'active'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'bg-card border border-border text-muted hover:text-foreground'
          }`}
        >
          Active ({activeList.length})
        </button>

        <button
          type="button"
          onClick={() => setTab('deactivated')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            tab === 'deactivated'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'bg-card border border-border text-muted hover:text-foreground'
          }`}
        >
          Deactivated ({deactivatedList.length})
        </button>
      </div>

      {/* Pending Approval Section */}
      {tab === 'pending' && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold">Pending approval</h2>
            <p className="mt-1 text-xs text-muted">
              Officials register with their official email. Their account stays
              inactive until you approve it.
            </p>
          </div>

          {pendingList.length === 0 ? (
            <p className="rounded-xl bg-secondary p-6 text-center text-xs text-muted">
              No pending official registration requests.
            </p>
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
                  {pendingList.map((official) => (
                    <tr key={official.id}>
                      <td className="py-4 font-semibold">{official.name}</td>
                      <td className="py-4 text-muted">{official.email}</td>
                      <td className="py-4 text-muted">{official.ward}</td>
                      <td className="py-4 text-xs text-muted">
                        {official.requestedAt || 'Recently'}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => approveOfficial(official.id)}
                          className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectOfficial(official.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 cursor-pointer"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Active Officials Section */}
      {tab === 'active' && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">Active officials</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Ward</th>
                  <th className="pb-3 font-medium">Last login</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeList.map((official) => (
                  <tr key={official.id}>
                    <td className="py-4 font-semibold">{official.name}</td>
                    <td className="py-4 text-muted">{official.ward}</td>
                    <td className="py-4 text-xs text-muted">
                      {official.lastLogin || 'Today'}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-500">
                        Active
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          alert(`Password reset link sent to ${official.email}`)
                        }
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary cursor-pointer"
                      >
                        Reset password
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleOfficialStatus(official.id, 'deactivated')
                        }
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-red-500 hover:border-red-500/40 cursor-pointer"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deactivated Officials Section */}
      {tab === 'deactivated' && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">Deactivated officials</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Ward</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deactivatedList.map((official) => (
                  <tr key={official.id}>
                    <td className="py-4 font-semibold">{official.name}</td>
                    <td className="py-4 text-muted">{official.ward}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-500">
                        Deactivated
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          toggleOfficialStatus(official.id, 'active')
                        }
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
                      >
                        Reactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteOfficialModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={inviteOfficial}
      />
    </div>
  );
}