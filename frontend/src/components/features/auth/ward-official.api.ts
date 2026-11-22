import api from '@/lib/axios';

export interface WardOfficialPayload {
  name: string;
  email: string;
  wardNumber: number;
  password: string;
}

export const registerWardOfficial = async (
  data: WardOfficialPayload
) => {
  const response = await api.post(
    '/ward-official/register',
    data
  );

  return response.data;
};