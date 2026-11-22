'use client';

import { useEffect, useState } from 'react';
import { AdminBudgetItem, BudgetAuditChange } from '@/types/admin';
import { adminApiClient } from '@/lib/admin-api';

const INITIAL_BUDGETS: AdminBudgetItem[] = [
  { id: 1, ward: 'Ward 10', category: 'Roads', allocated: 5.0, spent: 4.0, updatedBy: 'Ward 10 official' },
  { id: 2, ward: 'Ward 10', category: 'Water supply', allocated: 3.0, spent: 1.2, updatedBy: 'Ward 10 official' },
  { id: 3, ward: 'Ward 4', category: 'Sanitation', allocated: 2.5, spent: 2.1, updatedBy: 'Municipal admin' },
  { id: 4, ward: 'Ward 7', category: 'Drainage', allocated: 4.0, spent: 1.4, updatedBy: 'Ward 7 official' },
  { id: 5, ward: 'Ward 2', category: 'Roads', allocated: 3.5, spent: 2.8, updatedBy: 'Ward 2 official' },
];

const INITIAL_CHANGES: BudgetAuditChange[] = [
  {
    id: 1,
    ward: 'Ward 10',
    category: 'Roads',
    description: 'Spent Rs 3.8M to Rs 4.0M',
    updatedBy: 'Ward 10 official',
    date: '18 Nov',
  },
  {
    id: 2,
    ward: 'Ward 4',
    category: 'Sanitation',
    description: 'Allocated Rs 2.2M to Rs 2.5M',
    updatedBy: 'Municipal admin',
    date: '15 Nov',
  },
  {
    id: 3,
    ward: 'Ward 7',
    category: 'Drainage',
    description: 'Spent Rs 1.1M to Rs 1.4M',
    updatedBy: 'Ward 7 official',
    date: '12 Nov',
  },
];

export function useAdminBudget() {
  const [items, setItems] = useState<AdminBudgetItem[]>(INITIAL_BUDGETS);
  const [recentChanges, setRecentChanges] = useState<BudgetAuditChange[]>(INITIAL_CHANGES);

  useEffect(() => {
    adminApiClient
      .get('/admin/budgets')
      .then((res) => {
        if (res.data?.items) setItems(res.data.items);
        if (res.data?.recentChanges) setRecentChanges(res.data.recentChanges);
      })
      .catch(() => {});
  }, []);

  const saveBudgetItem = async (
    payload: Omit<AdminBudgetItem, 'id' | 'updatedBy'> & { id?: number }
  ) => {
    if (payload.id) {
      const existing = items.find((i) => i.id === payload.id);
      try {
        await adminApiClient.put(`/admin/budgets/${payload.id}`, payload);
      } catch {}
      setItems((prev) =>
        prev.map((item) =>
          item.id === payload.id
            ? { ...item, ...payload, updatedBy: 'Municipal admin' }
            : item
        )
      );
      if (existing) {
        setRecentChanges((prev) => [
          {
            id: Date.now(),
            ward: payload.ward,
            category: payload.category,
            description: `Spent Rs ${existing.spent.toFixed(1)}M to Rs ${payload.spent.toFixed(1)}M`,
            updatedBy: 'Municipal admin',
            date: 'Today',
          },
          ...prev,
        ]);
      }
    } else {
      try {
        await adminApiClient.post('/admin/budgets', payload);
      } catch {}
      setItems((prev) => [
        { ...payload, id: Date.now(), updatedBy: 'Municipal admin' },
        ...prev,
      ]);
      setRecentChanges((prev) => [
        {
          id: Date.now(),
          ward: payload.ward,
          category: payload.category,
          description: `Allocated Rs ${payload.allocated.toFixed(1)}M`,
          updatedBy: 'Municipal admin',
          date: 'Today',
        },
        ...prev,
      ]);
    }
  };

  return { items, recentChanges, saveBudgetItem };
}