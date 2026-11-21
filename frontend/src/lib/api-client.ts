const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function getAuthHeaders(isFormData = false): HeadersInit {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('auth_token')
      : null;

  return {
    Accept: 'application/json',
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isFormData = false
): Promise<Response> {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(isFormData),
      ...(options.headers || {}),
    },
  });
}