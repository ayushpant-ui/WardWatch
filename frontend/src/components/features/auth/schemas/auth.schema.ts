import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Name must contain at least 3 characters')
      .max(100, 'Name is too long'),

    email: z
      .string()
      .email('Please enter a valid email address'),

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

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;