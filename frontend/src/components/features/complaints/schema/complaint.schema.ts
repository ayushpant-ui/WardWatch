import { z } from 'zod';

export const complaintSchema = z.object({
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward: z.string().min(1, 'Ward is required'),
  category: z.enum(['Road', 'Water', 'Electricity', 'Sanitation', 'Drainage'], {
    message: 'Please select a valid category',
  }),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number(),
  longitude: z.number(),
  photo: z.any().optional(),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;