'use client';

import { useCallback, useEffect, useState } from 'react';
import { Complaint, ComplaintFormValues } from '@/types/wardwatch';
import { apiFetch } from '@/lib/api-client';

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 1041,
    title: 'Broken road near school gate',
    category: 'Road',
    description: 'Deep potholes near the school entrance causing waterlogging and traffic hazards.',
    province: 'Bagmati',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metro',
    ward: 'Ward 10',
    status: 'In progress',
    filedAt: '28 Oct',
    dueDate: '4 Nov',
    latitude: 27.7172,
    longitude: 85.324,
    timeline: [
      { step: 'Submitted', timestamp: '28 Oct, 9:40', completed: true },
      { step: 'Assigned to ward engineer', timestamp: '29 Oct, 11:15', completed: true },
      { step: 'Repair work started', timestamp: 'Due by 4 Nov', completed: false },
    ],
  },
  {
    id: 1036,
    title: 'Water pipe leakage',
    category: 'Water',
    description: 'Main drinking water pipeline leaking continuously along the main chowk.',
    province: 'Bagmati',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metro',
    ward: 'Ward 10',
    status: 'Resolved',
    filedAt: '20 Oct',
    latitude: 27.7155,
    longitude: 85.3261,
    timeline: [
      { step: 'Submitted', timestamp: '20 Oct, 8:15', completed: true },
      { step: 'Assigned to water technician', timestamp: '21 Oct, 10:00', completed: true },
      { step: 'Leakage sealed & verified', timestamp: '23 Oct, 16:30', completed: true },
    ],
  },
  {
    id: 1033,
    title: 'Streetlight not working',
    category: 'Electricity',
    description: 'Three consecutive streetlights on the residential lane are non-functional.',
    province: 'Bagmati',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metro',
    ward: 'Ward 10',
    status: 'Escalated',
    filedAt: '12 Oct',
    dueDate: 'Overdue',
    latitude: 27.7191,
    longitude: 85.3218,
    timeline: [
      { step: 'Submitted', timestamp: '12 Oct, 19:20', completed: true },
      { step: 'Assigned to ward electrician', timestamp: '14 Oct, 12:10', completed: true },
      { step: 'Escalated to municipal electrical unit', timestamp: '19 Oct, 09:00', completed: true },
    ],
  },
];

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/complaints', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data ?? [];
      setComplaints(list);
      setIsFallback(false);
    } catch {
      setComplaints(MOCK_COMPLAINTS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const createComplaint = async (
    values: ComplaintFormValues
  ): Promise<{ complaint?: Complaint; validationErrors?: Record<string, string[]> }> => {
    const formData = new FormData();
    formData.append('province', values.province);
    formData.append('district', values.district);
    formData.append('municipality', values.municipality);
    formData.append('ward', values.ward);
    formData.append('category', values.category);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('latitude', String(values.latitude));
    formData.append('longitude', String(values.longitude));

    if (values.photo && values.photo.length > 0) {
      formData.append('photo', values.photo[0]);
    }

    try {
      const res = await apiFetch('/complaints', { method: 'POST', body: formData }, true);
      const data = await res.json();

      if (res.status === 422 && data.errors) {
        return { validationErrors: data.errors };
      }
      if (!res.ok) throw new Error(data.message || 'Submit failed');

      const created: Complaint = data.data ?? data;
      setComplaints((prev) => [created, ...prev]);
      return { complaint: created };
    } catch {
      // Optimistic local fallback for demo
      const fallbackCreated: Complaint = {
        id: Math.floor(1045 + Math.random() * 900),
        title: values.title,
        category: values.category,
        description: values.description,
        province: values.province,
        district: values.district,
        municipality: values.municipality,
        ward: values.ward,
        status: 'Submitted',
        filedAt: 'Today',
        latitude: values.latitude,
        longitude: values.longitude,
        timeline: [
          {
            step: 'Submitted',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          },
          { step: 'Pending ward engineer review', timestamp: 'Awaiting assignment', completed: false },
        ],
      };
      setComplaints((prev) => [fallbackCreated, ...prev]);
      return { complaint: fallbackCreated };
    }
  };

  return { complaints, loading, isFallback, createComplaint, refetch: loadComplaints };
}