'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Building2, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import {
  loginSchema,
  LoginFormData,
} from '@/components/features/auth/schemas/auth.schema';
import { loginUser} from '@/components/features/auth/auth.api';

export default function OfficialsLoginPage() {
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');

      const response = await loginUser(data);
      const { accessToken, id, name, email, role } = response;

      if (role !== 'ward_admin') {
        setServerError(
          'Access denied. This portal is restricted to approved Ward Officials.'
        );
        return;
      }

      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem(
        'user',
        JSON.stringify({ id, name, email, role })
      );

      router.push('/ward/overview');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)
            .flat()
            .find((msg) => typeof msg === 'string');
          setServerError(firstError || 'Official login failed.');
        } else {
          setServerError(
            responseData?.message ||
              'Invalid credentials or your official account is still pending municipal approval.'
          );
        }
      } else {
        setServerError('Unable to connect to the server. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <Building2 size={14} />
              Ward Official Portal
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Ward Official Login
            </h1>
            <p className="text-xs text-muted">
              Sign in with your approved official email to manage ward complaints, projects, and budgets.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Official Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Official Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="official@municipality.gov.np"
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Server / Approval Error */}
            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Login as Ward Official'}
            </button>
          </form>

          {/* Link to your existing Officials Register Page */}
          <div className="border-t border-border pt-4 text-center space-y-1.5">
            <p className="text-xs text-muted">
              New ward official?{' '}
              <Link
                href="/officials/register"
                className="font-semibold text-primary hover:underline"
              >
                Request an official account
              </Link>
            </p>
            <p className="text-[11px] text-muted">
              Accounts remain inactive until approved by the Municipal Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}