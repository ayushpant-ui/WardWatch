import { z } from 'zod';

export const wardOfficialSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must contain at least 3 characters')
      .max(100, 'Name is too long'),

    email: z
      .string()
      .email('Please enter a valid email address'),

    wardNumber: z
      .number()
      .int('Ward number must be a whole number')
      .min(1, 'Ward number must be at least 1'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type WardOfficialFormData = z.infer<
  typeof wardOfficialSchema
>;