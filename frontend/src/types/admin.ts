export type AdminComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In progress'
  | 'Resolved'
  | 'Escalated';

export interface MunicipalOverviewStats {
  openComplaints: number;
  overdueComplaints: number;
  avgResolutionDays: number;
  municipalityScore: number;
}

export interface WardRankingItem {
  ward: string;
  score: number;
}

export interface AdminComplaint {
  id: number;
  ward: string;
  title: string;
  category: 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Drainage';
  status: AdminComplaintStatus;
  assignedTo: string | null;
  dueDate: string;
  isOverdue: boolean;
}

export interface AdminProject {
  id: number;
  name: string;
  ward: string;
  progress: number;
  status: 'On track' | 'Delayed' | 'Completed';
  deadline: string;
}

export interface AdminBudgetItem {
  id: number;
  ward: string;
  category: string;
  allocated: number; // in Millions (Rs)
  spent: number;     // in Millions (Rs)
  updatedBy: string;
}

export interface BudgetAuditChange {
  id: number;
  ward: string;
  category: string;
  description: string;
  updatedBy: string;
  date: string;
}

export interface OfficialAccount {
  id: number;
  name: string;
  email: string;
  ward: string;
  designation?: string;
  requestedAt?: string;
  lastLogin?: string;
  status: 'pending' | 'active' | 'deactivated';
}