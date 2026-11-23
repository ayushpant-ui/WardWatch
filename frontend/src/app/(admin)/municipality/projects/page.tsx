'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import api from '@/lib/axios';

interface ProjectItem {
  id: number;
  name: string;
  municipality?: string;
  ward: string;
  Amount: number;
  progress: number;
  status: 'On track' | 'Delayed' | 'Completed';
  deadline: string;
}

function formatNPR(amount: number) {
  return `NPR ${Number(amount || 0).toLocaleString('en-NP')}`;
}

export default function MunicipalityProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState('All wards');
  const [wardCount, setWardCount] = useState(19);

  // Modal state for Add / Edit Project
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 1');
  const [amount, setAmount] = useState<string>('0');
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'On track' | 'Delayed' | 'Completed'>('On track');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const rawUser =
      sessionStorage.getItem('user') || localStorage.getItem('user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user?.municipality) {
          setWardCount(
            user.municipality.toLowerCase().includes('bhimdatta') ? 19 : 32,
          );
        }
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ProjectItem[]>('/admin/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openAddModal = () => {
    setEditingProject(null);
    setErrorMsg('');
    setName('');
    setWard('Ward 1');
    setAmount('');
    setProgress(0);
    setStatus('On track');
    setDeadline('');
    setModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setErrorMsg('');
    setName(project.name);
    setWard(project.ward);
    setAmount(String(project.Amount ?? 0));
    setProgress(project.progress ?? 0);
    setStatus(project.status);
    setDeadline(project.deadline);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');

      const numericProgress = Number(progress) || 0;
      const payload = {
        name: name.trim(),
        ward,
        Amount: Math.round(Number(amount) || 0),
        progress: numericProgress,
        status: numericProgress === 100 ? 'Completed' : status,
        deadline: deadline.trim(),
      };

      if (editingProject) {
        await api.patch(`/admin/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/admin/projects', payload);
      }

      setModalOpen(false);
      await fetchProjects();
    } catch (err) {
      console.error('Failed to save project:', err);
      setErrorMsg('Failed to save project changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects =
    selectedWard === 'All wards'
      ? projects
      : projects.filter((p) => p.ward === selectedWard);

  const onTrackCount = filteredProjects.filter((p) => p.status === 'On track').length;
  const delayedCount = filteredProjects.filter((p) => p.status === 'Delayed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Projects
        </h1>

        <div className="flex items-center gap-3">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="All wards">All wards</option>
            {Array.from({ length: wardCount }, (_, i) => `Ward ${i + 1}`).map(
              (w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 cursor-pointer"
          >
            <Plus size={16} />
            Add project
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted">Total projects</p>
          <p className="mt-2 text-2xl font-bold">{filteredProjects.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted">On track</p>
          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {onTrackCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted">Delayed</p>
          <p className="mt-2 text-2xl font-bold text-red-500">{delayedCount}</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Ward</th>
                  <th className="pb-3 font-medium">Budget Amount</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Deadline</th>
                  <th className="pb-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-xs text-muted"
                    >
                      No projects found. Click "+ Add project" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="py-4 font-semibold">{project.name}</td>
                      <td className="py-4 text-muted">{project.ward}</td>
                      <td className="py-4 font-medium">
                        {formatNPR(project.Amount)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-emerald-500"
                              style={{
                                width: `${Math.min(project.progress, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            project.status === 'Completed' ||
                            project.status === 'On track'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : 'bg-red-500/15 text-red-500'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-muted">
                        {project.deadline}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted">
          Changes here appear on the public transparency page.
        </p>
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-secondary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Drainage and Sanitation, Haldukhal"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Ward</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {Array.from(
                      { length: wardCount },
                      (_, i) => `Ward ${i + 1}`,
                    ).map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Allocated Amount (NPR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="On track">On track</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Deadline
                  </label>
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g., 1 Dec"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}