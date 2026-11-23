'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  Clock,
  FolderKanban,
  Loader2,
  LogOut,
  Save,
  ShieldAlert,
} from 'lucide-react';
import {
  getWardDashboard,
  updateWardComplaintStatus,
  updateWardProjectProgress,
  WardComplaint,
  WardDashboardData,
} from '@/components/features/ward/ward.api';

const STATUS_OPTIONS = [
  'Submitted',
  'Assigned',
  'In progress',
  'Resolved',
  'Escalated',
] as const;

export default function WardAdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<WardDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] =
    useState<WardComplaint | null>(null);

  // Action form state for selected complaint
  const [nextStatus, setNextStatus] = useState<string>('In progress');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [savingComplaint, setSavingComplaint] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWardDashboard();
      setData(res);

      if (res.complaints.length > 0) {
        const current =
          res.complaints.find((c) => c.id === selectedComplaint?.id) ??
          res.complaints[0];
        setSelectedComplaint(current);
        setNextStatus(current.status);
        setAssignedTo(current.assignedTo ?? '');
        setDueDate(current.dueDate ?? '');
      } else {
        setSelectedComplaint(null);
      }
    } catch {
      sessionStorage.clear();
      router.replace('/officials/login');
    } finally {
      setLoading(false);
    }
  }, [router, selectedComplaint?.id]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const rawUser = sessionStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!token || user?.role !== 'ward_admin') {
      router.replace('/officials/login');
      return;
    }

    loadDashboard();
  }, [router, loadDashboard]);

  const handleSelectComplaint = (complaint: WardComplaint) => {
    setSelectedComplaint(complaint);
    setNextStatus(complaint.status);
    setAssignedTo(complaint.assignedTo ?? '');
    setDueDate(complaint.dueDate ?? '');
    setNote('');
    setFeedback('');
  };

  const handleSaveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setSavingComplaint(true);
      setFeedback('');
      await updateWardComplaintStatus(selectedComplaint.id, {
        status: nextStatus,
        assignedTo,
        dueDate,
        note,
      });
      setNote('');
      setFeedback('Complaint status & timeline updated.');
      await loadDashboard();
    } catch {
      setFeedback('Failed to update complaint.');
    } finally {
      setSavingComplaint(false);
    }
  };

  const handleProjectProgress = async (projectId: number, progress: number) => {
    try {
      await updateWardProjectProgress(projectId, { progress });
      await loadDashboard();
    } catch {
      setFeedback('Failed to update project progress.');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/officials/login');
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const filteredComplaints =
    statusFilter === 'All'
      ? data.complaints
      : data.complaints.filter((c) => c.status === statusFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 size={14} />
            {data.official.municipality} — Ward {data.official.wardNo}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Ward Official Console
          </h1>
          <p className="mt-1 text-sm text-muted">
            Signed in as <strong>{data.official.name}</strong> (
            {data.official.designation})
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-secondary cursor-pointer"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      {/* Ward KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Total Ward Issues</span>
            <ShieldAlert size={16} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{data.stats.totalComplaints}</p>
          <p className="mt-1 text-xs text-muted">
            {data.stats.pendingComplaints} awaiting action
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>In Progress</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {data.stats.inProgressComplaints}
          </p>
          <p className="mt-1 text-xs text-muted">Assigned to ward staff</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Resolved Issues</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {data.stats.resolvedComplaints}
          </p>
          <p className="mt-1 text-xs text-muted">Closed in Ward {data.official.wardNo}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Ward Projects</span>
            <FolderKanban size={16} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{data.projects.length}</p>
          <p className="mt-1 text-xs text-muted">
            Budget: NPR {data.stats.totalAllocated.toLocaleString('en-NP')}
          </p>
        </div>
      </div>

      {/* Main Split: Ward Complaints Queue (Left) | Action & Timeline Panel (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Queue */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">
              Ward {data.official.wardNo} Citizen Complaints
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...STATUS_OPTIONS] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-secondary text-muted hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No complaints in this status for Ward {data.official.wardNo}.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectComplaint(c)}
                    className={`w-full text-left rounded-xl border p-4 transition cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{c.title}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {c.category} • Filed by {c.citizenName} on {c.filedAt}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">
                      {c.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action & Timeline Drawer */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 space-y-5">
          {!selectedComplaint ? (
            <p className="text-sm text-muted">
              Select a complaint from the list to inspect details and update its resolution status.
            </p>
          ) : (
            <>
              <div>
                <span className="text-xs font-semibold uppercase text-primary">
                  Issue #{selectedComplaint.id} • {selectedComplaint.category}
                </span>
                <h3 className="mt-1 text-lg font-bold">
                  {selectedComplaint.title}
                </h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {selectedComplaint.description}
                </p>
                {selectedComplaint.citizenPhone && (
                  <p className="mt-2 text-xs text-muted">
                    Citizen Contact: <strong>{selectedComplaint.citizenPhone}</strong>
                  </p>
                )}
              </div>

              <form onSubmit={handleSaveComplaint} className="space-y-3 border-t border-border pt-4">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Update Status
                  </label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Assigned Field Staff
                    </label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="e.g., Ward Sub-Engineer"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Target Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Public Progress Note (recorded on timeline)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g., Site inspected, drainage repair team dispatched"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {feedback && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {feedback}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingComplaint}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  {savingComplaint ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {savingComplaint ? 'Saving Update...' : 'Save Status Update'}
                </button>
              </form>

              {/* Timeline History */}
              <div className="border-t border-border pt-4 space-y-2.5">
                <h4 className="text-xs font-semibold uppercase text-muted">
                  Resolution Timeline
                </h4>
                <div className="space-y-2">
                  {selectedComplaint.timeline.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-lg bg-background p-2.5 text-xs border border-border"
                    >
                      <p className="font-medium">{step.step}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {step.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ward Projects Progress Tracker */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Ward {data.official.wardNo} Development Projects
        </h2>
        {data.projects.length === 0 ? (
          <p className="text-sm text-muted">
            No infrastructure projects assigned to Ward {data.official.wardNo} yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{project.name}</p>
                    <p className="text-xs text-muted">
                      Deadline: {project.deadline}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {project.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Completion Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={project.progress}
                    onMouseUp={(e) =>
                      handleProjectProgress(
                        project.id,
                        Number((e.target as HTMLInputElement).value),
                      )
                    }
                    onTouchEnd={(e) =>
                      handleProjectProgress(
                        project.id,
                        Number((e.target as HTMLInputElement).value),
                      )
                    }
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}