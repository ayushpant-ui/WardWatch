import api from '@/lib/axios';

export interface WardTransparencyItem {
  wardNo: number;
  allocated: number;
  spent: number;
  utilization: number;
  totalComplaints: number;
  resolvedComplaints: number;
  resolution: number;
  projectsCount: number;
}

export interface PublicProject {
  id: number;
  title: string;
  wardNo: number;
  deadline: string;
  progress: number;
  status: string;
}

export interface PublicComplaint {
  id: number;
  title: string;
  category: string;
  municipality?: string;
  ward: string;
  status: string;
  filedAt: string;
}

export interface TransparencyData {
  municipality: string;
  maxWards: number;
  summary: {
    totalAllocated: number;
    totalSpent: number;
    utilizationRate: number;
    totalProjects: number;
    totalComplaints: number;
    resolvedComplaints: number;
    resolutionRate: number;
  };
  wardBreakdown: WardTransparencyItem[];
  projects: PublicProject[];
  recentComplaints: PublicComplaint[];
}

export const getTransparencyData = async (
  municipality?: string,
  ward?: string,
): Promise<TransparencyData> => {
  const response = await api.get<TransparencyData>('/transparency', {
    params: {
      ...(municipality && municipality !== 'all' ? { municipality } : {}),
      ...(ward && ward !== 'all' ? { ward } : {}),
    },
  });
  return response.data;
};