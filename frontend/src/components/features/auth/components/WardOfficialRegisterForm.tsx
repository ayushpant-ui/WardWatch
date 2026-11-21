'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  MUNICIPALITY_OPTIONS,
  WARD_NUMBERS,
  wardOfficialRegisterSchema,
  WardOfficialRegisterFormData,
} from '../schemas/official-register.schema';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function WardOfficialRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WardOfficialRegisterFormData>({
    resolver: zodResolver(wardOfficialRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      municipality: MUNICIPALITY_OPTIONS[0],
      ward_no: 1,
      designation: 'Ward Engineer',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: WardOfficialRegisterFormData) => {
    try {
      setServerError('');
      setSubmitted(false);

      await axios.post(`${API_BASE_URL}/official/register`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setSubmitted(true);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (error.response?.status === 422 && responseData?.errors) {
          Object.entries(responseData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field as keyof WardOfficialRegisterFormData, {
                type: 'server',
                message: String(messages[0]),
              });
            }
          });
          return;
        }

        setServerError(
          responseData?.message ||
            'Registration failed. Please check your details and try again.'
        );
      } else {
        setServerError('Unable to connect to the server. Please try again.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Registration Request Submitted
        </h2>
        <p className="text-sm text-muted">
          Your official account request has been sent to the Municipal Admin for verification. Your account will stay inactive until approved[cite: 14].
        </p>
        <Link
          href="/officials/login"
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Go to Official Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g., S. Karki"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Official Email & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Official Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="official@municipality.gov.np"
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Phone <span className="text-xs text-muted">(optional)</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+977-9800000000"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Municipality & Ward No. (Limited 1 to 20) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Municipality
            </label>
            <select
              {...register('municipality')}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
            >
              {MUNICIPALITY_OPTIONS.map((muni) => (
                <option key={muni} value={muni}>
                  {muni}
                </option>
              ))}
            </select>
            {errors.municipality && (
              <p className="mt-1 text-xs text-red-500">
                {errors.municipality.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Ward No.</label>
            <select
              {...register('ward_no', { valueAsNumber: true })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
            >
              {WARD_NUMBERS.map((num) => (
                <option key={num} value={num}>
                  Ward {num}
                </option>
              ))}
            </select>
            {errors.ward_no && (
              <p className="mt-1 text-xs text-red-500">
                {errors.ward_no.message}
              </p>
            )}
          </div>
        </div>

        {/* Designation */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Designation</label>
          <input
            {...register('designation')}
            type="text"
            placeholder="e.g., Ward Chairperson, Ward Secretary, Ward Engineer"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
          />
          {errors.designation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              {...register('password_confirmation')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          >
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? 'Submitting Request...' : 'Register as Ward Official'}
        </button>

        {/* Login Link */}
        <p className="text-center text-xs text-muted">
          Already approved?{' '}
          <Link
            href="/officials/login"
            className="font-semibold text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}