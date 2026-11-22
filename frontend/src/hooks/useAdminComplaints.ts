'use client';

import { useEffect, useState } from 'react';
import { AdminComplaint } from '@/types/admin';
import { adminApiClient } from '@/lib/admin-api';

const INITIAL_COMPLAINTS: AdminComplaint[] = [
  {
    id: 1042,
    ward: 'Ward 2',
    title: 'Blocked drainage',
    category: 'Drainage',
    status: 'Escalated',
    assignedTo: 'R. Shrestha',
    dueDate: 'Overdue',
    isOverdue: true,
  },
  {
    id: 1041,
    ward: 'Ward 10',
    title: 'Broken road near school',
    category: 'Road',
    status: 'In progress',
    assignedTo: 'S. Karki',
    dueDate: '22 Nov',
    isOverdue: false,
  },
  {
    id: 1039,
    ward: 'Ward 9',
    title: 'Garbage not collected',
    category: 'Sanitation',
    status: 'Submitted',
    assignedTo: null,
    dueDate: '23 Nov',
    isOverdue: false,
  },
  {
    id: 1036,
    ward: 'Ward 4',
    title: 'Water pipe leakage',
    category: 'Water',
    status: 'Resolved',
    assignedTo: 'M. Tamang',
    dueDate: 'Done',
    isOverdue: false,
  },
  {
    id: 1033,
    ward: 'Ward 7',
    title: 'Streetlight not working',
    category: 'Electricity',
    status: 'Assigned',
    assignedTo: 'S. Karki',
    dueDate: '25 Nov',
    isOverdue: false,
  },
  {
    id: 1030,
    ward: 'Ward 10',
    title: 'Pothole on main road',
    category: 'Road',
    status: 'In progress',
    assignedTo: 'S. Karki',
    dueDate: '27 Nov',
    isOverdue: false,
  },
];

export function useAdminComplaints() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>(INITIAL_COMPLAINTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminApiClient
      .get('/admin/complaints')
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        if (list.length > 0) setComplaints(list);
      })
      .catch(() => {
        // Keep fallback mock data
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const assignOfficial = async (complaintId: number, officialName: string) => {
    try {
      await adminApiClient.patch(`/admin/complaints/${complaintId}/assign`, {
        assigned_to: officialName,
      });
    } catch {
      // Optimistic fallback
    }
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, assignedTo: officialName, status: 'Assigned' }
          : c
      )
    );
  };

  return { complaints, loading, assignOfficial };
}