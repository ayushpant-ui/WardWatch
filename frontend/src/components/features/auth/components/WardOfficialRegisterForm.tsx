'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Eye, EyeOff, Loader2 } from 'lucide-react';

import {
  wardOfficialSchema,
  WardOfficialFormData,
} from '../schemas/ward-official.schema';

import { registerWardOfficial } from '../ward-official.api';

export default function WardOfficialRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WardOfficialFormData>({
    resolver: zodResolver(wardOfficialSchema),
    defaultValues: {
      name: '',
      email: '',
      wardNumber: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: WardOfficialFormData) => {
    setServerError('');
    setSuccessMessage('');

    try {
      const response = await registerWardOfficial({
        name: data.name,
        email: data.email,
        wardNumber: data.wardNumber,
        password: data.password,
      });

      setSuccessMessage(
        response.message ||
          'Your registration request has been submitted. Await approval.'
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        setServerError(
          responseData?.message ||
            'Unable to submit registration. Please try again.'
        );
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white';

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ward Official Registration
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Submit your details to request ward official access to WardWatch.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            {...register('name')}
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            className={inputClass}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            {...register('email')}
            type="email"
            placeholder="official@example.com"
            autoComplete="email"
            className={inputClass}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Ward Number */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ward Number
          </label>

          <input
            {...register('wardNumber', {
              valueAsNumber: true,
            })}
            type="number"
            min="1"
            placeholder="Enter your ward number"
            className={inputClass}
          />

          {errors.wardNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.wardNumber.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={
                showConfirmPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30"
          >
            {serverError}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400"
          >
            {successMessage}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Submitting...
            </>
          ) : (
            'Submit Registration Request'
          )}
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-green-700 hover:underline"
        >
          Login
        </Link>
      </p>

    </div>
  );
}