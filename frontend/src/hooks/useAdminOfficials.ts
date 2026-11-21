'use client';

import { useEffect, useState } from 'react';
import { OfficialAccount } from '@/types/admin';
import { adminApiClient } from '@/lib/admin-api';

const INITIAL_OFFICIALS: OfficialAccount[] = [
  {
    id: 1,
    name: 'Sunita Rai',
    email: 'sunita.rai@example.com',
    ward: 'Ward 5',
    designation: 'Ward Secretary',
    requestedAt: '19 Nov',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Bikash Gurung',
    email: 'bikash.g@example.com',
    ward: 'Ward 12',
    designation: 'Ward Engineer',
    requestedAt: '19 Nov',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Anita Thapa',
    email: 'anita.t@example.com',
    ward: 'Ward 3',
    designation: 'Field Supervisor',
    requestedAt: '18 Nov',
    status: 'pending',
  },
  {
    id: 4,
    name: 'S. Karki',
    email: 's.karki@wardwatch.gov.np',
    ward: 'Ward 10',
    lastLogin: 'Today',
    status: 'active',
  },
  {
    id: 5,
    name: 'R. Shrestha',
    email: 'r.shrestha@wardwatch.gov.np',
    ward: 'Ward 2',
    lastLogin: 'Yesterday',
    status: 'active',
  },
  {
    id: 6,
    name: 'M. Tamang',
    email: 'm.tamang@wardwatch.gov.np',
    ward: 'Ward 4',
    lastLogin: '3 days ago',
    status: 'active',
  },
  {
    id: 7,
    name: 'P. Lama',
    email: 'p.lama@wardwatch.gov.np',
    ward: 'Ward 7',
    lastLogin: '6 days ago',
    status: 'active',
  },
  {
    id: 8,
    name: 'D. Adhikari',
    email: 'd.adhikari@wardwatch.gov.np',
    ward: 'Ward 8',
    lastLogin: '14 days ago',
    status: 'deactivated',
  },
];

export function useAdminOfficials() {
  const [officials, setOfficials] = useState<OfficialAccount[]>(INITIAL_OFFICIALS);

  useEffect(() => {
    adminApiClient
      .get('/admin/officials')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        if (list.length > 0) setOfficials(list);
      })
      .catch(() => {});
  }, []);

  const approveOfficial = async (id: number) => {
    try {
      await adminApiClient.patch(`/admin/officials/${id}/approve`);
    } catch {}
    setOfficials((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: 'active', lastLogin: 'Never' } : o
      )
    );
  };

  const rejectOfficial = async (id: number) => {
    try {
      await adminApiClient.delete(`/admin/officials/${id}/reject`);
    } catch {}
    setOfficials((prev) => prev.filter((o) => o.id !== id));
  };

  const toggleOfficialStatus = async (
    id: number,
    nextStatus: 'active' | 'deactivated'
  ) => {
    try {
      await adminApiClient.patch(`/admin/officials/${id}/status`, {
        status: nextStatus,
      });
    } catch {}
    setOfficials((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const inviteOfficial = async (payload: {
    name: string;
    email: string;
    ward: string;
    designation: string;
  }) => {
    try {
      await adminApiClient.post('/admin/officials/invite', payload);
    } catch {}
    setOfficials((prev) => [
      {
        id: Date.now(),
        ...payload,
        lastLogin: 'Invited',
        status: 'active',
      },
      ...prev,
    ]);
  };

  return {
    officials,
    approveOfficial,
    rejectOfficial,
    toggleOfficialStatus,
    inviteOfficial,
  };
}