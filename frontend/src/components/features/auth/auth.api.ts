import api from '@/lib/axios';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};