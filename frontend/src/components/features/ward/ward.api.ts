import api from '@/lib/axios';

export interface WardTimelineStep {
  id: number;
  step: string;
  timestamp: string;
  completed: boolean;
}

export interface WardComplaint {
  id: number;
  title: string;
  category: string;
  description: string;
  ward: string;
  municipality: string;
  status: 'Submitted' | 'Assigned' | 'In progress' | 'Resolved' | 'Escalated';
  assignedTo: string | null;
  dueDate: string | null;
  isOverdue: boolean;
  photoUrl: string | null;
  citizenName: string;
  citizenPhone: string | null;
  filedAt: string;
  timeline: WardTimelineStep[];
}

export interface WardProject {
  id: number;
  name: string;
  ward: string;
  progress: number;
  status: string;
  deadline: string;
}

export interface WardDashboardData {
  official: {
    id: number;
    name: string;
    email: string;
    designation: string;
    municipality: string;
    wardNo: number;
  };
  stats: {
    totalComplaints: number;
    pendingComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    escalatedComplaints: number;
    totalAllocated: number;
    totalSpent: number;
    activeProjects: number;
  };
  complaints: WardComplaint[];
  projects: WardProject[];
}

export const getWardDashboard = async (): Promise<WardDashboardData> => {
  const response = await api.get<WardDashboardData>('/ward/dashboard');
  return response.data;
};

export const updateWardComplaintStatus = async (
  complaintId: number,
  payload: {
    status: string;
    assignedTo?: string;
    dueDate?: string;
    note?: string;
  },
) => {
  const response = await api.patch(
    `/ward/complaints/${complaintId}/status`,
    payload,
  );
  return response.data;
};

export const updateWardProjectProgress = async (
  projectId: number,
  payload: { progress: number; status?: string },
) => {
  const response = await api.patch(`/ward/projects/${projectId}`, payload);
  return response.data;
};