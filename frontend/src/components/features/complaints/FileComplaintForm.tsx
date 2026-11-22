'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Crosshair, ImagePlus, Loader2, Send, X } from 'lucide-react';
import { Complaint, ComplaintCategory } from '@/types/wardwatch';
import { NEPAL_LOCATIONS, WARDS_LIST } from '@/lib/nepal-locations';
import {
  complaintSchema,
  ComplaintFormData,
} from '@/components/features/complaints/schema/complaint.schema';
import { createCitizenComplaint } from '@/components/features/complaints/complaints.api';

const LocationPickerMap = dynamic(() => import('@/components/maps/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full rounded-xl bg-secondary border border-border animate-pulse flex items-center justify-center text-xs text-muted">
      Loading OpenStreetMap...
    </div>
  ),
});

const CATEGORIES: ComplaintCategory[] = [
  'Road',
  'Water',
  'Electricity',
  'Sanitation',
  'Drainage',
];

interface FileComplaintFormProps {
  onSuccess?: (complaint: Complaint) => void;
}

export default function FileComplaintForm({ onSuccess }: FileComplaintFormProps) {
  const [locating, setLocating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      province: 'Bagmati',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metro',
      ward: 'Ward 10',
      category: 'Road',
      title: '',
      description: '',
      latitude: 27.7172,
      longitude: 85.324,
    },
  });

  const selectedProvince = watch('province');
  const selectedDistrict = watch('district');
  const lat = watch('latitude');
  const lng = watch('longitude');

  const districts = Object.keys(NEPAL_LOCATIONS[selectedProvince] || {});
  const municipalities = NEPAL_LOCATIONS[selectedProvince]?.[selectedDistrict] || [];

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setServerError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setServerError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitude', Number(pos.coords.latitude.toFixed(4)), { shouldValidate: true });
        setValue('longitude', Number(pos.coords.longitude.toFixed(4)), { shouldValidate: true });
        setLocating(false);
      },
      () => {
        setServerError('Unable to fetch GPS location. Please tap the map directly.');
        setLocating(false);
      }
    );
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setValue('photo', undefined);
  };

  const onSubmit = async (values: ComplaintFormData) => {
    setSubmittedSuccess(false);
    setServerError('');

    const { complaint, validationErrors } = await createCitizenComplaint(values);

    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, messages]) => {
        setError(field as keyof ComplaintFormData, {
          type: 'server',
          message: messages[0],
        });
      });
      return;
    }

    if (complaint) {
      setSubmittedSuccess(true);
      setPhotoPreview(null);
      reset({
        ...values,
        title: '',
        description: '',
        photo: undefined,
      });
      onSuccess?.(complaint);
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-semibold">File a complaint</h2>
        <p className="text-xs text-muted mt-0.5">
          Pin the exact location on OpenStreetMap and attach evidence.
        </p>
      </div>

      {submittedSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-3.5 py-2.5 text-xs text-primary font-medium"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Complaint submitted successfully!</span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Cascading Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Province</label>
            <select
              {...register('province', {
                onChange: (e) => {
                  const nextProv = e.target.value;
                  const nextDist = Object.keys(NEPAL_LOCATIONS[nextProv])[0];
                  const nextMuni = NEPAL_LOCATIONS[nextProv][nextDist][0];
                  setValue('district', nextDist);
                  setValue('municipality', nextMuni);
                },
              })}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {Object.keys(NEPAL_LOCATIONS).map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-xs text-red-500">{errors.province.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">District</label>
            <select
              {...register('district', {
                onChange: (e) => {
                  const nextDist = e.target.value;
                  const nextMuni = NEPAL_LOCATIONS[selectedProvince]?.[nextDist]?.[0] || '';
                  setValue('municipality', nextMuni);
                },
              })}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Municipality</label>
            <select
              {...register('municipality')}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {municipalities.map((muni) => (
                <option key={muni} value={muni}>
                  {muni}
                </option>
              ))}
            </select>
            {errors.municipality && (
              <p className="mt-1 text-xs text-red-500">{errors.municipality.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Ward</label>
            <select
              {...register('ward')}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {WARDS_LIST.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            {errors.ward && <p className="mt-1 text-xs text-red-500">{errors.ward.message}</p>}
          </div>
        </div>

        {/* Category & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted mb-1">Issue Title</label>
            <input
              type="text"
              placeholder="e.g., Broken road near school gate"
              {...register('title')}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Description</label>
          <textarea
            rows={3}
            placeholder="Describe the issue and nearby landmarks..."
            {...register('description')}
            className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Leaflet OpenStreetMap Pin Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Pin Location</span>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer disabled:opacity-60"
            >
              <Crosshair className="w-3.5 h-3.5" />
              {locating ? 'Locating...' : 'Use my location'}
            </button>
          </div>

          <LocationPickerMap
            latitude={lat}
            longitude={lng}
            onChange={(nextLat, nextLng) => {
              setValue('latitude', nextLat, { shouldValidate: true });
              setValue('longitude', nextLng, { shouldValidate: true });
            }}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Upload Photo</label>
          <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/60 hover:border-primary px-4 py-3 text-xs text-muted cursor-pointer transition-colors">
            <ImagePlus className="w-4 h-4 text-primary" />
            <span>{photoPreview ? 'Change photo' : 'Upload photo (JPG, PNG)'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register('photo', {
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhotoPreview(URL.createObjectURL(file));
                },
              })}
            />
          </label>

          {photoPreview && (
            <div className="relative mt-2">
              <img
                src={photoPreview}
                alt="Complaint preview"
                className="h-28 w-full object-cover rounded-xl border border-border"
              />
              <button
                type="button"
                onClick={clearPhoto}
                aria-label="Remove photo"
                className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-foreground hover:text-red-500 border border-border cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white dark:text-slate-950 font-semibold py-2.5 px-4 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit complaint
            </>
          )}
        </button>
      </form>
    </div>
  );
}