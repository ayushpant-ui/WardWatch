'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const inviteSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  ward: z.string().min(1),
  designation: z.string().min(2, 'Designation is required'),
});

type InviteValues = z.infer<typeof inviteSchema>;

interface InviteOfficialModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: InviteValues) => Promise<void>;
}

export default function InviteOfficialModal({
  open,
  onClose,
  onInvite,
}: InviteOfficialModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: '',
      email: '',
      ward: 'Ward 10',
      designation: 'Ward Engineer',
    },
  });

  if (!open) return null;

  const submit = async (values: InviteValues) => {
    await onInvite(values);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Invite ward official</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-secondary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Full Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g., R. Adhikari"
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Official Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="official@municipality.gov.np"
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Assigned Ward
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
                Designation
              </label>
              <input
                {...register('designation')}
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
              Send invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}