'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { AdminProject } from '@/types/admin';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name is required'),
  ward: z.string().min(1, 'Ward is required'),
  progress: z.number().min(0).max(100),
  status: z.enum(['On track', 'Delayed', 'Completed']),
  deadline: z.string().min(2, 'Deadline is required'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormModalProps {
  open: boolean;
  initialData?: AdminProject | null;
  onClose: () => void;
  onSave: (data: ProjectFormValues & { id?: number }) => Promise<void>;
}

export default function ProjectFormModal({
  open,
  initialData,
  onClose,
  onSave,
}: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      ward: 'Ward 10',
      progress: 0,
      status: 'On track',
      deadline: '30 Jan',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: '',
        ward: 'Ward 10',
        progress: 0,
        status: 'On track',
        deadline: '30 Jan',
      });
    }
  }, [initialData, reset, open]);

  if (!open) return null;

  const submit = async (values: ProjectFormValues) => {
    await onSave({ ...values, id: initialData?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {initialData ? 'Edit development project' : 'Add development project'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Project Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g., Drainage upgrade"
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Ward
              </label>
              <select
                {...register('ward')}
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`).map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Progress (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                {...register('progress', { valueAsNumber: true })}
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="On track">On track</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Deadline
              </label>
              <input
                {...register('deadline')}
                placeholder="e.g., 30 Jan"
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white dark:text-slate-950 hover:opacity-90 cursor-pointer"
            >
              {initialData ? 'Save changes' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}