export type ComplaintStatus = 'Submitted' | 'In progress' | 'Resolved' | 'Escalated';

export type ComplaintCategory =
  | 'Road'
  | 'Water'
  | 'Electricity'
  | 'Sanitation'
  | 'Drainage';

export interface TimelineEvent {
  step: string;
  timestamp: string;
  completed: boolean;
}

export interface Complaint {
  id: number | string;
  title: string;
  category: ComplaintCategory;
  description: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  status: ComplaintStatus;
  filedAt: string;
  dueDate?: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  timeline: TimelineEvent[];
}

export interface ComplaintFormValues {
  province: string;
  district: string;
  municipality: string;
  ward: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photo?: FileList;
}

export interface BudgetItem {
  id: number | string;
  category: string;
  allocated: number; // in Millions (Rs)
  spent: number;     // in Millions (Rs)
}

export interface DevelopmentProject {
  id: number | string;
  name: string;
  ward: string;
  progress: number;
  status: 'On track' | 'Delayed' | 'Completed';
  deadline: string;
}

export interface WardScore {
  rank: number;
  ward: string;
  score: number;
}