import api from '@/lib/axios';

// Registration

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};

// Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: 'citizen' | 'ward_admin' | 'municipal_admin';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    data
  );

  return response.data;
};