export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type ComplaintCategory =
  | 'road'
  | 'water'
  | 'electricity'
  | 'sanitation'
  | 'drainage'
  | 'public_property'
  | 'other';

export interface Complaint {
  id: number;
  complaintNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;

  ward: {
    id: number;
    name: string;
  };

  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  wardId: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  photo?: File;
}