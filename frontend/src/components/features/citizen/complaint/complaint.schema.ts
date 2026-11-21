import { z } from 'zod';

export const complaintSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must contain at least 5 characters')
    .max(150, 'Title cannot exceed 150 characters'),

  description: z
    .string()
    .min(20, 'Please provide at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),

  category: z.enum([
    'road',
    'water',
    'electricity',
    'sanitation',
    'drainage',
    'public_property',
    'other',
  ]),

  wardId: z
    .string()
    .min(1, 'Please select your ward'),

  address: z
    .string()
    .max(250, 'Address is too long')
    .optional(),

  latitude: z
    .string()
    .optional(),

  longitude: z
    .string()
    .optional(),
}).superRefine((data, ctx) => {
  const latitude = data.latitude?.trim();
  const longitude = data.longitude?.trim();

  if ((latitude && !longitude) || (!latitude && longitude)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Both latitude and longitude are required',
      path: ['latitude'],
    });
  }

  if (latitude && longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid latitude',
        path: ['latitude'],
      });
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid longitude',
        path: ['longitude'],
      });
    }
  }
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;