import { z } from 'zod';

export const MUNICIPALITY_OPTIONS = [
  'Kathmandu Metropolitan City',
  'Lalitpur Metropolitan City',
  'Bhimdatta Municipality',
  'Dhangadhi Sub-Metropolitan City',
] as const;

export const WARD_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

export const wardOfficialRegisterSchema = z
  .object({
    name: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Please enter a valid official email address'),
    phone: z.string().optional(),
    municipality: z.string().min(1, 'Please select a municipality'),
    ward_no: z
      .number({ message: 'Please select a valid ward number' })
      .int()
      .min(1, 'Ward number must be between 1 and 20')
      .max(20, 'Ward number cannot exceed 20'),
    designation: z.string().min(2, 'Designation / role title is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type WardOfficialRegisterFormData = z.infer<
  typeof wardOfficialRegisterSchema
>;