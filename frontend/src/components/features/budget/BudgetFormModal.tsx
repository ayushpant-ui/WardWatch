'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { AdminBudgetItem } from '@/types/admin';

const budgetSchema = z.object({
  ward: z.string().min(1),
  category: z.string().min(2, 'Category is required'),
  allocated: z.number().min(0.1, 'Must be greater than 0'),
  spent: z.number().min(0),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormModalProps {
  open: boolean;
  initialData?: AdminBudgetItem | null;
  onClose: () => void;
  onSave: (data: BudgetFormValues & { id?: number }) => Promise<void>;
}

export default function BudgetFormModal({
  open,
  initialData,
  onClose,
  onSave,
}: BudgetFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      ward: 'Ward 10',
      category: 'Roads',
      allocated: 5.0,
      spent: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ ward: 'Ward 10', category: 'Roads', allocated: 5.0, spent: 0 });
    }
  }, [initialData, reset, open]);

  if (!open) return null;

  const submit = async (values: BudgetFormValues) => {
    await onSave({ ...values, id: initialData?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {initialData ? 'Edit budget allocation' : 'Add budget item'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-secondary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
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
                Category
              </label>
              <input
                {...register('category')}
                placeholder="e.g., Roads"
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Allocated (NRs)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('allocated', { valueAsNumber: true })}
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Spent (NRs)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('spent', { valueAsNumber: true })}
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
              Save budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}