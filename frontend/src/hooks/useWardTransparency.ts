'use client';

import { useEffect, useState } from 'react';
import { BudgetItem, DevelopmentProject, WardScore } from '@/types/wardwatch';
import { apiFetch } from '@/lib/api-client';

const MOCK_BUDGETS: BudgetItem[] = [
  { id: 1, category: 'Roads', allocated: 5.0, spent: 4.0 },
  { id: 2, category: 'Water supply', allocated: 3.0, spent: 1.2 },
  { id: 3, category: 'Sanitation', allocated: 2.5, spent: 2.1 },
];

const MOCK_PROJECTS: DevelopmentProject[] = [
  { id: 1, name: 'Drainage upgrade', ward: 'Ward 10', progress: 70, status: 'On track', deadline: '30 Jan' },
  { id: 2, name: 'Community hall', ward: 'Ward 10', progress: 35, status: 'Delayed', deadline: '15 Dec' },
  { id: 3, name: 'Road paving, phase 2', ward: 'Ward 10', progress: 100, status: 'Completed', deadline: '10 Nov' },
];

const MOCK_SCORES: WardScore[] = [
  { rank: 1, ward: 'Ward 10', score: 78 },
  { rank: 2, ward: 'Ward 4', score: 72 },
  { rank: 3, ward: 'Ward 7', score: 65 },
];

export function useWardTransparency(ward: string) {
  const [budgets, setBudgets] = useState<BudgetItem[]>(MOCK_BUDGETS);
  const [projects, setProjects] = useState<DevelopmentProject[]>(MOCK_PROJECTS);
  const [scores, setScores] = useState<WardScore[]>(MOCK_SCORES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch(`/transparency?ward=${encodeURIComponent(ward)}`);
        if (!res.ok) throw new Error('Fallback to mock');
        const data = await res.json();
        if (!active) return;
        if (data.budgets) setBudgets(data.budgets);
        if (data.projects) setProjects(data.projects);
        if (data.scores) setScores(data.scores);
      } catch {
        if (!active) return;
        setBudgets(MOCK_BUDGETS);
        setProjects(MOCK_PROJECTS);
        setScores(MOCK_SCORES);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ward]);

  return { budgets, projects, scores, loading };
}