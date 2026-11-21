
import api from '@/lib/axios';

// Registration

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/user/register', data);

  return response.data;
};

// Login

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'citizen' | 'ward_admin' | 'municipal_admin';
}

export interface LoginResponse extends AuthUser {
  message: string;
  accessToken: string;
}

export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/user/login',
    data
  );

  return response.data;
};
