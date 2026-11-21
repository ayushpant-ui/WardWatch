import api from '@/lib/axios';

import {
  Complaint,
  CreateComplaintPayload,
} from './complaint.types';

export interface ComplaintListResponse {
  success: boolean;
  message: string;
  data: {
    data: Complaint[];
    meta?: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

// Get citizen's complaints
export const getMyComplaints = async (): Promise<ComplaintListResponse> => {
  const token = sessionStorage.getItem('accessToken');

  const response = await api.get('/complaints/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get individual complaint
export const getComplaintById = async (
  id: number
): Promise<Complaint> => {
  const token = sessionStorage.getItem('accessToken');

  const response = await api.get(`/complaints/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

// Create complaint
export const createComplaint = async (
  data: CreateComplaintPayload
) => {
  const token = sessionStorage.getItem('accessToken');

  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('ward_id', String(data.wardId));

  if (data.address) {
    formData.append('address', data.address);
  }

  if (data.latitude !== undefined) {
    formData.append('latitude', String(data.latitude));
  }

  if (data.longitude !== undefined) {
    formData.append('longitude', String(data.longitude));
  }

  if (data.photo) {
    formData.append('photo', data.photo);
  }

  const response = await api.post('/complaints', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};