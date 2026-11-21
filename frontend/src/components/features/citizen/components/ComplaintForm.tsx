'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import {
  ImagePlus,
  Loader2,
  MapPin,
  Send,
} from 'lucide-react';

import {
  complaintSchema,
  ComplaintFormData,
} from '../complaint/complaint.schema';

import { createComplaint } from '../complaint/complaints.api';

const categories = [
  { value: 'road', label: 'Road and Infrastructure' },
  { value: 'water', label: 'Drinking Water' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation and Waste' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'public_property', label: 'Public Property' },
  { value: 'other', label: 'Other' },
];

export default function ComplaintForm() {
  const router = useRouter();

  const [photo, setPhoto] = useState<File | undefined>();
  const [serverError, setServerError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),

    defaultValues: {
      title: '',
      description: '',
      category: 'road',
      wardId: '',
      address: '',
      latitude: '',
      longitude: '',
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setServerError('');

      const response = await createComplaint({
        title: data.title,
        description: data.description,
        category: data.category,
        wardId: Number(data.wardId),
        address: data.address || undefined,
        latitude: data.latitude ? Number(data.latitude) : undefined,
        longitude: data.longitude ? Number(data.longitude) : undefined,
        photo,
      });

      // Navigate to the newly created complaint
      const complaintId = response.data?.id;

      if (complaintId) {
        router.push(`/complaints/${complaintId}`);
      } else {
        router.push('/complaints');
      }

      router.refresh();

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        setServerError(
          responseData?.message ||
          'Unable to submit your complaint. Please try again.'
        );
      } else {
        setServerError('Something went wrong.');
      }
    }
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setPhotoError('');

    if (!file) {
      setPhoto(undefined);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Image size must be less than 2 MB.');
      event.target.value = '';
      return;
    }

    setPhoto(file);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7"
    >

      {/* Basic Information */}
      <section className="space-y-5">

        <div>
          <h2 className="text-lg font-bold">
            Complaint Information
          </h2>

          <p className="mt-1 text-sm text-muted">
            Provide details about the issue you want to report.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Complaint Title *
          </label>

          <input
            {...register('title')}
            placeholder="Example: Damaged road near community school"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          {errors.title && (
            <p className="mt-1 text-xs text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Complaint Category *
          </label>

          <select
            {...register('category')}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-1 text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>

          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe the problem, its location, and how it affects the community..."
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

      </section>

      {/* Location */}
      <section className="space-y-5 border-t border-border pt-7">

        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-primary" />

          <h2 className="text-lg font-bold">
            Issue Location
          </h2>
        </div>

        {/* Ward */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ward *
          </label>

          <select
            {...register('wardId')}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">
              Select your ward
            </option>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ward) => (
              <option key={ward} value={ward}>
                Ward {ward}
              </option>
            ))}
          </select>

          {errors.wardId && (
            <p className="mt-1 text-xs text-red-500">
              {errors.wardId.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Address / Landmark
          </label>

          <input
            {...register('address')}
            placeholder="Example: Near community school"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          {errors.address && (
            <p className="mt-1 text-xs text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Coordinates */}
        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Latitude
            </label>

            <input
              {...register('latitude')}
              type="number"
              step="any"
              placeholder="Example: 28.6139"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {errors.latitude && (
              <p className="mt-1 text-xs text-red-500">
                {errors.latitude.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Longitude
            </label>

            <input
              {...register('longitude')}
              type="number"
              step="any"
              placeholder="Example: 80.4542"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {errors.longitude && (
              <p className="mt-1 text-xs text-red-500">
                {errors.longitude.message}
              </p>
            )}
          </div>

        </div>

        <p className="text-xs text-muted">
          Enter the location where the issue occurred, not necessarily your current location.
        </p>

      </section>

      {/* Photo Upload */}
      <section className="space-y-4 border-t border-border pt-7">

        <div className="flex items-center gap-2">
          <ImagePlus size={20} className="text-primary" />

          <h2 className="text-lg font-bold">
            Supporting Photograph
          </h2>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary p-8 text-center transition hover:border-primary">

          <ImagePlus size={30} className="mb-3 text-muted" />

          <p className="text-sm font-medium">
            Click to upload an image
          </p>

          <p className="mt-1 text-xs text-muted">
            PNG, JPG or JPEG (Maximum 2 MB)
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handlePhotoChange}
            className="hidden"
          />

        </label>

        {photo && (
          <p className="text-sm text-primary">
            Selected: {photo.name}
          </p>
        )}

        {photoError && (
          <p className="text-xs text-red-500">
            {photoError}
          </p>
        )}

      </section>

      {/* Server Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950"
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-6">

        <button
          type="button"
          onClick={() => router.push('/complaints')}
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !!photoError}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={17} />
              Submit Complaint
            </>
          )}
        </button>

      </div>

    </form>
  );
}