'use client';

import { useEffect, useState } from 'react';
import {
  AdminComplaint,
  MunicipalOverviewStats,
  WardRankingItem,
} from '@/types/admin';
import { adminApiClient } from '@/lib/admin-api';

const MOCK_STATS: MunicipalOverviewStats = {
  openComplaints: 186,
  overdueComplaints: 23,
  avgResolutionDays: 4.1,
  municipalityScore: 71,
};

const MOCK_QUEUE: AdminComplaint[] = [
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
    dueDate: '4 Nov',
    isOverdue: false,
  },
  {
    id: 1039,
    ward: 'Ward 9',
    title: 'Garbage not collected',
    category: 'Sanitation',
    status: 'Submitted',
    assignedTo: null,
    dueDate: '6 Nov',
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
];

const MOCK_RANKING: WardRankingItem[] = [
  { ward: 'Ward 10', score: 78 },
  { ward: 'Ward 4', score: 72 },
  { ward: 'Ward 7', score: 65 },
  { ward: 'Ward 2', score: 58 },
  { ward: 'Ward 9', score: 51 },
];

export function useAdminOverview(selectedWard: string) {
  const [stats, setStats] = useState<MunicipalOverviewStats>(MOCK_STATS);
  const [queue, setQueue] = useState<AdminComplaint[]>(MOCK_QUEUE);
  const [ranking, setRanking] = useState<WardRankingItem[]>(MOCK_RANKING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchOverview() {
      setLoading(true);
      try {
        const res = await adminApiClient.get('/admin/overview', {
          params: selectedWard !== 'All wards' ? { ward: selectedWard } : {},
        });
        if (!active) return;
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.queue) setQueue(res.data.queue);
        if (res.data.ranking) setRanking(res.data.ranking);
      } catch {
        if (!active) return;
        const filteredQueue =
          selectedWard === 'All wards'
            ? MOCK_QUEUE
            : MOCK_QUEUE.filter((item) => item.ward === selectedWard);
        setQueue(filteredQueue);
        setStats(MOCK_STATS);
        setRanking(MOCK_RANKING);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchOverview();
    return () => {
      active = false;
    };
  }, [selectedWard]);

  return { stats, queue, ranking, loading };
}