// import api from '@/lib/axios';

// // Registration
// export interface RegisterPayload {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation?: string;
// }

// export const registerUser = async (data: RegisterPayload) => {
//   const response = await api.post('/user/register', data);
//   return response.data;
// };

// // Login
// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AuthUser {
//   id: number;
//   name: string;
//   email: string;
//   role: 'citizen' | 'ward_admin' | 'municipal_admin';
//   municipality?: string;
//   ward_no?: number | null;
// }

// export interface LoginResponse extends AuthUser {
//   message?: string;
//   accessToken: string;
// }

// // Unified login function (works for municipal_admin, ward_admin, and citizen)
// export const loginAdmin = async (
//   data: LoginPayload
// ): Promise<LoginResponse> => {
//   const response = await api.post<LoginResponse>('/login', data);

//   // Persist token and user details for protected /admin/* requests
//   if (typeof window !== 'undefined' && response.data?.accessToken) {
//     localStorage.setItem('accessToken', response.data.accessToken);
//     localStorage.setItem(
//       'user',
//       JSON.stringify({
//         id: response.data.id,
//         name: response.data.name,
//         email: response.data.email,
//         role: response.data.role,
//         municipality: response.data.municipality,
//         ward_no: response.data.ward_no,
//       })
//     );
//   }

//   return response.data;
// };

// // Fetch Municipal Admin Overview (requires municipal_admin JWT)
// export const getAdminOverview = async (ward?: string) => {
//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

//   const response = await api.get('/admin/overview', {
//     params: ward ? { ward } : undefined,
//     headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//   });

//   return response.data;
// };

// export const logoutUser = () => {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//   }
// };

import api from '@/lib/axios';

// Registration
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
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
  municipality?: string;
  ward_no?: number | null;
}

export interface LoginResponse extends AuthUser {
  message?: string;
  accessToken: string;
}

export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', data);

  if (typeof window !== 'undefined' && response.data?.accessToken) {
    sessionStorage.setItem('accessToken', response.data.accessToken);
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        municipality: response.data.municipality,
        ward_no: response.data.ward_no,
      })
    );
  }

  return response.data;
};

// Alias so both Citizen/Official login forms (loginUser) and AdminLoginPage (loginAdmin) work
export const loginAdmin = loginUser;