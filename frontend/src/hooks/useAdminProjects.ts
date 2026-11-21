'use client';

import { useEffect, useState } from 'react';
import { AdminProject } from '@/types/admin';
import { adminApiClient } from '@/lib/admin-api';

const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: 1,
    name: 'Drainage upgrade',
    ward: 'Ward 10',
    progress: 70,
    status: 'On track',
    deadline: '30 Jan',
  },
  {
    id: 2,
    name: 'Community hall',
    ward: 'Ward 4',
    progress: 35,
    status: 'Delayed',
    deadline: '15 Dec',
  },
  {
    id: 3,
    name: 'Road paving, phase 2',
    ward: 'Ward 7',
    progress: 100,
    status: 'Completed',
    deadline: '10 Nov',
  },
  {
    id: 4,
    name: 'Water tank repair',
    ward: 'Ward 2',
    progress: 55,
    status: 'On track',
    deadline: '20 Jan',
  },
  {
    id: 5,
    name: 'Park fencing',
    ward: 'Ward 9',
    progress: 20,
    status: 'Delayed',
    deadline: '28 Dec',
  },
];

export function useAdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>(INITIAL_PROJECTS);

  useEffect(() => {
    adminApiClient
      .get('/admin/projects')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        if (list.length > 0) setProjects(list);
      })
      .catch(() => {});
  }, []);

  const saveProject = async (payload: Omit<AdminProject, 'id'> & { id?: number }) => {
    if (payload.id) {
      try {
        await adminApiClient.put(`/admin/projects/${payload.id}`, payload);
      } catch {}
      setProjects((prev) =>
        prev.map((p) => (p.id === payload.id ? { ...p, ...payload, id: payload.id } : p))
      );
    } else {
      let createdId = Date.now();
      try {
        const res = await adminApiClient.post('/admin/projects', payload);
        if (res.data?.id) createdId = res.data.id;
      } catch {}
      setProjects((prev) => [{ ...payload, id: createdId }, ...prev]);
    }
  };

  return { projects, saveProject };
}