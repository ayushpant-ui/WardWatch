
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import { Eye, EyeOff, Loader2 } from 'lucide-react';

import {
  loginSchema,
  LoginFormData,
} from '../schemas/auth.schema';

import { loginUser } from '../auth.api';

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Login Handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');

      // Call Laravel Login API
      const response = await loginUser(data);

      // Laravel returns a flat response
      const { accessToken, id, name, email, role } = response;

      // Store authentication data
      sessionStorage.setItem('accessToken', accessToken);

      sessionStorage.setItem(
        'user',
        JSON.stringify({ id, name, email, role })
      );

      // Redirect according to user role
      switch (role) {
        case 'citizen':
          router.push('/complaints');
          break;

        case 'ward_admin':
          router.push('/ward/overview');
          break;

        case 'municipal_admin':
          router.push('/municipality/overview');
          break;

        default:
          router.push('/');
      }

    } catch (error) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)
            .flat()
            .find((message) => typeof message === 'string');

          setServerError(
            firstError || 'Login failed. Please try again.'
          );
        } else {
          setServerError(
            responseData?.message ||
              'Invalid email or password.'
          );
        }
      } else {
        setServerError(
          'Unable to connect to the server. Please try again.'
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email Address
        </label>

        <input
          {...register('email')}
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? 'Hide password' : 'Show password'
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* API Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950"
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && (
          <Loader2 size={18} className="animate-spin" />
        )}

        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
